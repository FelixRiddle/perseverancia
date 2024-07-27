import apiRouter from "./api";

const express = require('express');

/**
 * Main router
 */
export default function mainRouter() {
	const router = express.Router();
	
	router.use("/api", apiRouter());
	
	return router;
}
