import express from "express";
import personalLogRouter from "./personal-log";

/**
 * 
 */
export default function apiRouter() {
	const router = express.Router();
    
	router.use("/personal-log", personalLogRouter());
    
    return router;
}
