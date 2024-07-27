import { Model, InferCreationAttributes, InferAttributes, Sequelize, DataTypes } from "sequelize";
import PersonalLog from "./PersonalLog";
import Note from "./Note";

/**
 * Notes
 */
export default class LogNotes extends Model<
    InferAttributes<
		LogNotes
    >,
    InferCreationAttributes<
		LogNotes,
        { omit: "id" }
    >> {
    declare id: number;
}

/**
 * Create log notes model
 */
export function createLogNotesModel(
	conn: Sequelize,
	personalLog: typeof PersonalLog,
	note: typeof Note,
) {
	const TABLE_NAME = "log-notes";
	const Model = LogNotes.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		}
    }, {
        sequelize: conn,
        tableName: TABLE_NAME,
        modelName: TABLE_NAME,
    });
	
	Model.belongsTo(personalLog);
	Model.belongsTo(note);
	
	return Model;
}
