import { Models } from "felixriddle.ts-app-models";
import User from "../User";

declare global {
	namespace Express {
		interface Request {
			user?: User,
			models: Models,
		}
	}
}
