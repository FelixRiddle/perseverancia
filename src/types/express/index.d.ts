import { Models } from "felixriddle.ts-app-models";
import User from "../User";
import { StatusMessage } from "../StatusMessage";

declare global {
	namespace Express {
		interface Request {
			user?: User,
			messages: Array<StatusMessage>,
			models: Models,
		}
	}
}
