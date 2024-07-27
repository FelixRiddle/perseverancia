import { Model, InferCreationAttributes, InferAttributes, Sequelize, DataTypes } from "sequelize";

/**
 * Note
 * 
 * Extra notes I use to put on some logs
 */
export default class Note extends Model<
    InferAttributes<
		Note
    >,
    InferCreationAttributes<
		Note,
        { omit: "id" | "note" }
    >> {
    declare id: number;
	declare note: string;
}

/**
 * Listening to model
 */
export function createNoteModel(conn: Sequelize) {
	const TABLE_NAME = "note";
	const Model = Note.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		note: {
			type: DataTypes.STRING,
			validate: {
                notEmpty: {
                    msg: "Note is required"
                }
            }
		}
    }, {
        sequelize: conn,
        tableName: TABLE_NAME,
        modelName: TABLE_NAME,
    });
	
	return Model;
}
