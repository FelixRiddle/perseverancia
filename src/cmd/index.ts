import { ArgumentParser } from "argparse";
import dotenv from "dotenv";
import Models from "../model/Models";
import startServer from "../server";

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
 * Sync
 */
async function syncModels(models: Models) {
	for(const model of models.models()) {
		try {
			await model.sync();
		} catch(err: any) {
			console.log(`Couldn't sync model: `, model);
		}
	}
}

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
	await syncModels(models);
	
    if(args.serve) {
		await startServer(models);
    }
};

executeCommands();
