import express from "express";
import personalLogRouter from "./personalLog";

/**
 * 
 */
export default function apiRouter() {
	const router = express.Router();
    
	router.use("/personal-log", personalLogRouter());
    
    return router;
}
