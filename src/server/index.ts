import express, { Request } from "express";
import cors from "cors";
import color from "ansi-color";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";
import ConnectSequelizeSession from "connect-session-sequelize";
import { Models, TablesController } from "felixriddle.ts-app-models";
import bodyParser from "body-parser";

import mainRouter from "./routes";
import { frontendUrl, isDevelopment, isProduction, serverPort } from "../lib/config/env";

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
export default async function startServer(useModels?: Models) {
	// Use models or create new
	// Mainly because we don't want to waste resources
	let models = useModels;
	if(!models) {
		const models = new Models();
		const tc = new TablesController(models);
		await tc.upAll();
	}
	
	const app = express();
	
	const isDev = isDevelopment();
	
	// Cors
	let whitelist: Array<string> = [];
	const frontUrl = process.env.FRONTEND_URL;
	if(!frontUrl) {
		if(isDev) {
			// Haha what a nice trick
			for(let i = 0; i < 20; i++) {
				const port = 3000 + i;
				whitelist.push(`http://localhost:${port}`);
			}
		}
	} else {
		whitelist.push(frontUrl);
	}
    app.use(cors({
		// Allow the use of credentials
		credentials: true,
		origin: function (origin: any, callback: (error?: any, pass?: boolean) => void) {
			// This happens when you load your page in the same origin that you are making API calls to.
			// The browser doesn't set the "Origin" header unless the API call's domain is different from
			// the one where the page is being served.
			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				const error = new Error('Not allowed by CORS');
				console.error(error);
				callback(error);
			}
		}
	}));
    
	// First things first, serve public files
	app.use("/public", express.static("public"));
	
	// Only after the public files are served we use the rest of the middlewares
    app.use(express.json());
	
	// Body parser
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	
	// Cheap tricks 😝
	const secretToken = process.env.SECRET_TOKEN || `${uuidv4()}-${uuidv4()}`;
	const secretKeyName = process.env.SECRET_KEY_NAME || uuidv4();
	app.use(cookieParser(secretToken));
	
	const SequelizeStore = ConnectSequelizeSession(session.Store);
	const sequelizeStore = new SequelizeStore({
		db: models.connection,
		tableName: "session"
	});
	
	// Create table
	sequelizeStore.sync();
	
	app.use(session({
		store: sequelizeStore,
		secret: secretToken,
		// key: secretKeyName,
		resave: false,
		saveUninitialized: true,
	}));
	
    // Routes
	app.use((req, res, next) => {
		printRoute(req);
		
		req.messages = [];
		req.models = models;
		
		return next();
	});
    app.use(mainRouter());
	
	console.log(`Is production?: `, isProduction());
	console.log(`Frontend url: `, frontendUrl());
	const PORT = serverPort();
	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
}
