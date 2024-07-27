import express from "express";
import musicRouter from "./music";
import expandData from "../../../../lib/miscellaneous/expandData";
import { Op } from "sequelize";

/**
 * 
 */
export default function personalLogRouter() {
    const router = express.Router();
    
	router.use("/music", musicRouter());
	// this.note,
	// this.listeningTo,
	// this.logNotes
	
	// Log endpoints
    // Search
	// Sorted out through description
    router.get("/search/:query", async (req, res) => {
        try {
            const {
                PersonalLog
            } = req.models;
            
            const searchTerm = req.params.query;
            
            const logs = await PersonalLog.findAll({
                where: {
                    description: {
                        [Op.like]: `%${searchTerm}%`
                    }
                },
                raw: true,
            });
            
            return res.status(200).send({
                logs
            });
        } catch(err) {
            console.error(err);
            req.flash("messages", [{
                message: "Error 500: Internal error",
                type: "error"
            }]);
            
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
				PersonalLog
			} = req.models;
			
			const logs = await PersonalLog.findAll({
				raw: true,
			});
			
			return res.status(200).send({
				logs
			});
		} catch(err) {
			console.error(err);
            req.flash("messages", [{
                message: "Error 500: Internal error",
                type: "error"
            }]);
            
            const expanded = await expandData(req);
            return res.status(500).send({
                ...expanded
			});
		}
	});
	
	router.post("/", async (req, res) => {
		try {
			const {
				PersonalLog
			} = req.models;
			
			await PersonalLog.create(req.body);
			
			req.flash("messages", [{
				message: "Ok",
				type: "success"
			}]);
			
			const expanded = await expandData(req);
			return res.status(200).send({
				...expanded
			});
		} catch(err) {
			console.error(err);
			req.flash("messages", [{
				message: "Error 500: Internal error",
				type: "error"
			}]);
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.put("/:id", async (req, res) => {
		try {
			const {
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id);
			if(!log) {
				return res.status(404).send({
					messages: [{
						message: "Log not found",
						error: true,
						type: 'error',
					}]
				});
			}
			
			// Update
			Object.assign(log, req.body);
			await log.save();
			
			req.flash("messages", [{
                message: "Updated",
                type: "success"
            }]);
			
            const expanded = await expandData(req);
			return res.status(200).send({
				...expanded,
			});
		} catch(err) {
			console.error(err);
			req.flash("messages", [{
				message: "Error 500: Internal error",
				type: "error"
			}]);
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.get("/:id", async (req, res) => {
		try {
			const {
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id, {
				raw: true,
			});
			if(!log) {
				req.flash("messages", [{
					message: "Not found",
					error: true,
					type: 'error',
				}]);
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			return res.status(200).send({
				log
			});
		} catch(err) {
			console.error(err);
			req.flash("messages", [{
				message: "Error 500: Internal error",
				type: "error"
			}]);
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
	router.delete("/:id", async (req, res) => {
		try {
			const {
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id);
			if(!log) {
				req.flash("messages", [{
					message: "Not found",
					error: true,
					type: 'error',
				}]);
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			await log.destroy();
			
			req.flash("messages", [{
				message: "Deleted",
				type: "success"
			}]);
			
			const expanded = await expandData(req);
			return res.status(200).send({
				...expanded
			});
		} catch(err) {
			console.error(err);
			req.flash("messages", [{
				message: "Error 500: Internal error",
				type: "error"
			}]);
			
			const expanded = await expandData(req);
			return res.status(500).send({
				...expanded
			});
		}
	});
	
    return router;
}
