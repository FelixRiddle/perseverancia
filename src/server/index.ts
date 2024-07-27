import express, { Request } from "express";
import cors from "cors";
import color from "ansi-color";

import Models from "../model/Models";
import { PORT } from "../lib/config/env";
import mainRouter from "./routes";

/**
 * Print method and route
 */
function printRoute(req: Request) {
	switch(req.method) {
		case "POST": {
			const method = color.set(`${req.method}`, "yellow");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "GET": {
			const method = color.set(`${req.method}`, "green");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "DELETE": {
			const method = color.set(`${req.method}`, "red");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "PUT": {
			const method = color.set(`${req.method}`, "blue");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "PATCH": {
			const method = color.set(`${req.method}`, "magenta");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
	}
}

/**
 * Models
 */
export default async function startServer(models: Models) {
	const app = express();
	
    app.use(express.json());
	
	// Cors
	const whitelist = ['http://localhost:3011', 'http://localhost:3003'];
    app.use(cors({
		origin: function (origin: any, callback: (error?: any, pass?: boolean) => void) {
			if (whitelist.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		}
	}));
    
    // Routes
	app.use((req, res, next) => {
		printRoute(req);
		
		req.models = models;
		
		return next();
	});
    app.use(mainRouter());
	
	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
}
