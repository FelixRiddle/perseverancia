import { Sequelize } from "sequelize";
import mysqlConn from "../lib/connection/mysqlConn";
import PersonalLog, { createPersonalLogModel } from "./PersonalLog";
import ListeningTo, { createListeningToModel } from "./ListeningTo";
import Music, { createMusicModel } from "./Music";
import Note, { createNoteModel } from "./Note";
import LogNotes, { createLogNotesModel } from "./LogNotes";

/**
 * Models
 * 
 * This class is to use the same connection to use models
 * Something that I haven't been doing, because I just didn't know.
 */
export default class Models {
    connection: Sequelize;
    
	music: typeof Music;
	note: typeof Note;
	
	personalLog: typeof PersonalLog;
	
	listeningTo: typeof ListeningTo;
	logNotes: typeof LogNotes;
	
    /**
     * Constructor
     */
    constructor() {
        this.connection = mysqlConn();
        
		this.music = createMusicModel(this.connection);
		this.note = createNoteModel(this.connection);
		
		this.personalLog = createPersonalLogModel(this.connection);
		
		// Personal log junction tables
		this.listeningTo = createListeningToModel(this.connection, this.music, this.personalLog);
		this.logNotes = createLogNotesModel(this.connection, this.personalLog, this.note);
    }
	
    /**
     * Models from high independence to low independence
     */
    models() {
        const modelArray = [
			this.music,
            this.note,
			
			this.personalLog,
			
			this.listeningTo,
			this.logNotes
        ];
        
        return modelArray;
    }
}
