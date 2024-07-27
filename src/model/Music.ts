import { Model, InferCreationAttributes, InferAttributes, Sequelize, DataTypes } from "sequelize";

/**
 * Music / Song
 */
export default class Music extends Model<
    InferAttributes<
		Music
    >,
    InferCreationAttributes<
		Music,
        { omit: "id" | "composer" | "name" | "url" }
    >> {
    declare id: number;
	declare composer: string;
	declare name: string;
	declare url: string;
}

/**
 * Music model
 */
export function createMusicModel(conn: Sequelize) {
	const TABLE_NAME = "music";
	const Model = Music.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		composer: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		url: {
			type: DataTypes.STRING,
            validate: {
                isUrl: {
                    msg: "URL is not valid",
                },
            }
		}
    }, {
        sequelize: conn,
        tableName: TABLE_NAME,
        modelName: TABLE_NAME,
    });
	
	return Model;
}
