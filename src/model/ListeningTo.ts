import { Model, InferCreationAttributes, InferAttributes, Sequelize, DataTypes } from "sequelize";
import Music from "./Music";
import PersonalLog from "./PersonalLog";

/**
 * Listening to
 * 
 * I have many months logs in which I was listening to music while doing something
 */
export default class ListeningTo extends Model<
    InferAttributes<
		ListeningTo
    >,
    InferCreationAttributes<
		ListeningTo,
        { omit: "id" }
    >> {
    declare id: number;
}

/**
 * Listening to model
 */
export function createListeningToModel(
	conn: Sequelize,
	music: typeof Music,
	personalLog: typeof PersonalLog,
) {
	const TABLE_NAME = "listening-to";
	const Model = ListeningTo.init({
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
	
	Model.belongsTo(music);
	Model.belongsTo(personalLog);
	
	return Model;
}
