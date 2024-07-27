import express from "express";
import musicRouter from "./music";

/**
 * 
 */
export default function personalLogRouter() {
    const router = express.Router();
    
	router.use("/music", musicRouter());
	// this.note,
	// this.personalLog,
	// this.listeningTo,
	// this.logNotes
	
    return router;
}
