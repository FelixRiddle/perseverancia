import express from "express";
import expandData from "../../../../lib/miscellaneous/expandData";

/**
 * Music router
 */
export default function musicRouter() {
	const router = express.Router();
	
	router.post("/", async (req, res) => {
		try {
			const {
				Music
			} = req.models;
			
			await Music.create(req.body);
			
			req.flash("messages", [{
				message: "Music information inserted",
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

