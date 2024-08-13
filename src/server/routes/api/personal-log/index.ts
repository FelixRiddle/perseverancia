import express from "express";
import musicRouter from "./music";
import expandData from "../../../../lib/miscellaneous/expandData";
import { Op } from "sequelize";
import noteRouter from "./note";
import { Note } from "../../../../types/Note";

/**
 * 
 */
export default function personalLogRouter() {
    const router = express.Router();
	
	// TODO: I don't really use this one anymore maybe implement it later
	// listeningTo,
	
	router.use("/music", musicRouter());
	router.use("/note", noteRouter());
	
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
				order: [
					["start", "DESC"]
				],
                raw: true,
            });
			
			// Booleans are 1 or 0, but they should be actual booleans 'true' or 'false'
			logs.forEach(log => {
                log.timeAccurate = log.timeAccurate ? (log.timeAccurate === 1 ? true : false) : false;
				log.untilTimeAccurate = log.untilTimeAccurate? (log.untilTimeAccurate === 1? true : false) : false;
				log.mixed = log.mixed? (log.mixed === 1? true : false) : false;
            });
			
            return res.status(200).send({
                logs
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
	
	router.get("/count", async (req, res) => {
		try {
            const {
                PersonalLog
            } = req.models;
            
            const count = await PersonalLog.count();
            
            return res.status(200).send({
                count
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
	
	router.post("/page", async (req, res) => {
		try {
			const queryInfo = req.body;
			
			const {
                query,
                page,
                perPage
            } = queryInfo;
			
			const {
                PersonalLog
            } = req.models;
			
			// Where clause
			const where: any = {};
            if(query) {
                where.description = {
                    [Op.like]: `%${query}%`
                };
            };
			
			// Find logs from most recent to oldest
			const logs = await PersonalLog.findAll({
                where,
				order: [
					["start", "DESC"]
				],
                limit: perPage,
                offset: (page - 1) * perPage,
                raw: true,
            });
			
			// Booleans are 1 or 0, but they should be actual booleans 'true' or 'false'
			logs.forEach(log => {
                log.timeAccurate = log.timeAccurate ? (log.timeAccurate === 1 ? true : false) : false;
				log.untilTimeAccurate = log.untilTimeAccurate? (log.untilTimeAccurate === 1? true : false) : false;
				log.mixed = log.mixed? (log.mixed === 1? true : false) : false;
            });
            
            return res.status(200).send({
                logs
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
				PersonalLog
			} = req.models;
			
			const logs = await PersonalLog.findAll({
				raw: true,
				order: [
					["start", "DESC"]
				],
			});
			
			// Booleans are 1 or 0, but they should be actual booleans 'true' or 'false'
			logs.forEach(log => {
                log.timeAccurate = log.timeAccurate ? (log.timeAccurate === 1 ? true : false) : false;
				log.untilTimeAccurate = log.untilTimeAccurate? (log.untilTimeAccurate === 1? true : false) : false;
				log.mixed = log.mixed? (log.mixed === 1? true : false) : false;
            });
			
			return res.status(200).send({
				logs
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
				Address,
				LogNotes,
				Note,
				PersonalLog
			} = req.models;
			
			const data = req.body;
			
			// Set address id
			const givenAddress = data.address;
			if(givenAddress) {
				let address = await Address.findOne({
					where: {
						street: givenAddress.street,
						city: givenAddress.city,
						state: givenAddress.state,
						country: givenAddress.country
					}
				});
				if(!address) {
					// Address not found, create it
					address = await Address.create(givenAddress);
				}
				
				data.addressId = address.id;
				
				// Delete address
				delete data.address;
			}
			
			// Manage notes
			let notes = data.notes;
			if(notes && notes.length > 0) {
				const createNotes = notes.map((note: string) => {
					return {
                        note,
                    };
				});
				const newNotes = await Note.bulkCreate(createNotes);
				const notesCreated = newNotes.map((note) => note.get({
					raw: true
				}));
				
				notes = notesCreated;
			}
			
			// Create log
			const logCreated = await PersonalLog.create(req.body);
			
			// Relation notes - log
			if(notes && notes.length > 0) {
				const logNotes = notes.map((note: Note) => {
                    return {
                        personalLogId: logCreated.id,
                        noteId: note.id
                    };
                });
                await LogNotes.bulkCreate(logNotes);
			}
			
			req.messages = [{
				message: "Log created",
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
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id);
			if(!log) {
				req.messages = [{
					message: "Log not found",
					error: true,
					type: 'error',
				}];
				
				const expanded = await expandData(req);
				return res.status(404).send({
					...expanded
				});
			}
			
			// Update
			Object.assign(log, req.body);
			await log.save();
			
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
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id, {
				raw: true,
			});
			
			if(!log) {
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
			
			log.timeAccurate = log.timeAccurate ? (log.timeAccurate === 1 ? true : false) : false;
			log.untilTimeAccurate = log.untilTimeAccurate? (log.untilTimeAccurate === 1? true : false) : false;
			log.mixed = log.mixed? (log.mixed === 1? true : false) : false;
			
			return res.status(200).send({
				log
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
				PersonalLog
			} = req.models;
			
			// Find data
			const log = await PersonalLog.findByPk(req.params.id);
			if(!log) {
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
			
			await log.destroy();
			
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
