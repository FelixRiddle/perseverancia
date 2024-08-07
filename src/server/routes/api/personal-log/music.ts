import express from "express";
import expandData from "../../../../lib/miscellaneous/expandData";
import { Op } from "sequelize";

/**
 * Music router
 */
export default function musicRouter() {
	const router = express.Router();
	
    // Search
	// Sorted out through the name
    router.get("/search/:query", async (req, res) => {
        try {
            const {
                Music
            } = req.models;
            
            const searchTerm = req.params.query;
            
            const playlist = await Music.findAll({
                where: {
                    name: {
                        [Op.like]: `%${searchTerm}%`
                    }
                },
                raw: true,
            });
            
            return res.status(200).send({
                playlist
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
				Music
			} = req.models;
			
			const playlist = await Music.findAll({
				raw: true,
			});
			
			return res.status(200).send({
				playlist
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
				Music
			} = req.models;
			
			await Music.create(req.body);
			
			req.messages = [{
				message: "Music information inserted",
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
	
	router.put("/:id", async (req, res) => {
		try {
			const {
				Music
			} = req.models;
			
			// Find data
			const music = await Music.findByPk(req.params.id);
			if(!music) {
				return res.status(404).send({
					messages: [{
						message: "Music not found",
						error: true,
						type: 'error',
					}]
				});
			}
			
			// Update
			Object.assign(music, req.body);
			await music.save();
			
			req.messages = [{
                message: "Music updated",
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
				Music
			} = req.models;
			
			// Find data
			const music = await Music.findByPk(req.params.id, {
				raw: true,
			});
			if(!music) {
				req.messages = [{
					message: "Music not found",
					error: true,
					type: 'error',
				}];
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			return res.status(200).send({
				music
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
				Music
			} = req.models;
			
			// Find data
			const music = await Music.findByPk(req.params.id);
			if(!music) {
				req.messages = [{
					message: "Music not found",
					error: true,
					type: 'error',
				}];
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			await music.destroy();
			
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
