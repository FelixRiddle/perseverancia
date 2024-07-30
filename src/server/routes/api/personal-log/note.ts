import express from "express";
import { Op } from "sequelize";

import expandData from "../../../../lib/miscellaneous/expandData";

/**
 * Notes router
 */
export default function noteRouter() {
	const router = express.Router();
	
	// Search
	// Sorted out through the name
    router.get("/search/:query", async (req, res) => {
        try {
            const {
                Note
            } = req.models;
            
            const searchTerm = req.params.query;
            
            const notes = await Note.findAll({
                where: {
                    note: {
                        [Op.like]: `%${searchTerm}%`
                    }
                },
                raw: true,
            });
            
            return res.status(200).send({
                notes
            });
        } catch(err) {
            console.error(err);
			req.messages = [{
                message: "Error 500: Internal error",
                type: "error"
            }];
            
            const expanded = await expandData(req);
            return res.status(500).send({
                ...expanded
            });
        }
    });
	
	// TODO: Pagination
	router.get("/", async (req, res) => {
		try {
			const {
				Note
			} = req.models;
			
			const notes = await Note.findAll({
				raw: true,
			});
			
			return res.status(200).send({
				notes
			});
		} catch(err) {
			console.error(err);
			req.messages = [{
                message: "Error 500: Internal error",
                type: "error"
            }];
            
            const expanded = await expandData(req);
            return res.status(500).send({
                ...expanded
			});
		}
	});
	
	router.post("/", async (req, res) => {
		try {
			const {
				Note
			} = req.models;
			
			const note = await Note.create(req.body, {
				raw: true,
			});
			
			req.messages = [{
				message: "Inserted",
				type: "success"
			}];
			
			const expanded = await expandData(req);
			return res.status(200).send({
				...expanded,
				// We may need the note's id
				note,
			});
		} catch(err) {
			console.error(err);
			req.messages = [{
                message: "Error 500: Internal error",
                type: "error"
            }];
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.put("/:id", async (req, res) => {
		try {
			const {
				Note
			} = req.models;
			
			// Find data
			const note = await Note.findByPk(req.params.id);
			if(!note) {
				return res.status(404).send({
					messages: [{
						message: "Not found",
						error: true,
						type: 'error',
					}]
				});
			}
			
			// Update
			Object.assign(note, req.body);
			await note.save();
			
			req.messages = [{
                message: "Updated",
                type: "success"
            }];
			
            const expanded = await expandData(req);
			return res.status(200).send({
				...expanded,
			});
		} catch(err) {
			console.error(err);
			req.messages = [{
				message: "Error 500: Internal error",
				type: "error"
			}];
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.get("/:id", async (req, res) => {
		try {
			const {
				Note
			} = req.models;
			
			// Find data
			const note = await Note.findByPk(req.params.id, {
				raw: true,
			});
			if(!note) {
				req.messages = [{
					message: "Not found",
					error: true,
					type: 'error',
				}];
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			return res.status(200).send({
				note
			});
		} catch(err) {
			console.error(err);
			req.messages = [{
				message: "Error 500: Internal error",
				type: "error"
			}];
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.delete("/:id", async (req, res) => {
		try {
			const {
				Note
			} = req.models;
			
			// Find data
			const note = await Note.findByPk(req.params.id);
			if(!note) {
				req.messages = [{
					message: "Not found",
					error: true,
					type: 'error',
				}];
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			await note.destroy();
			
			req.messages = [{
				message: "Deleted",
				type: "success"
			}];
			
			const expanded = await expandData(req);
			return res.status(200).send({
				...expanded
			});
		} catch(err) {
			console.error(err);
			req.messages = [{
				message: "Error 500: Internal error",
				type: "error"
			}];
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	return router;
}
