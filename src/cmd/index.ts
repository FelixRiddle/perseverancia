import { ArgumentParser } from "argparse";
import dotenv from "dotenv";
import startServer from "../server";
import { Models, TablesController } from "felixriddle.ts-app-models";

const parser = new ArgumentParser({
    description: "Good roots startup"
});

parser.add_argument("--serve", {
    help: "Run server",
    action: "store_true"
});

parser.add_argument("--test", {
    help: "Run tests",
    action: "store_true"
});

/**
 * Execute commands
 */
export default async function executeCommands() {
	// Setup dotenv
	dotenv.config({
		path: ".env"
	});
    
    const args = parser.parse_args();
    
	const models = new Models();
	const tc = new TablesController(models);
	await tc.upAll();
	
    if(args.serve) {
		await startServer(models);
    }
};

executeCommands();
