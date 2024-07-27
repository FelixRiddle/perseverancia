import { Model, InferCreationAttributes, InferAttributes, Sequelize, DataTypes } from "sequelize";

/**
 * Personal log
 */
export default class PersonalLog extends Model<
    InferAttributes<
		PersonalLog
    >,
    InferCreationAttributes<
		PersonalLog,
        { omit: 'id' | "description" | "until" | "updated" | 'createdAt' | 'updatedAt' }
    >> {
    declare id: number;
	
	// Main information
	declare timeAccurate: boolean;
	declare start: Date;
	declare type: string;
	declare description: string;
	declare details: object;
	
	declare mixed: boolean;
	declare links: string[];
	declare references: string[];
	
	// Other date information
	declare untilTimeAccurate: boolean;
	declare until: Date;
	declare updated: Date;
	
    declare createdAt: Date;
    declare updatedAt: Date;
}

/**
 * Personal log
 */
export function createPersonalLogModel(
	conn: Sequelize,
) {
	const TABLE_NAME = "personal-log";
	const Model = PersonalLog.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		timeAccurate: {
			type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
		},
		start: {
			type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Start date is required"
                }
            }
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Type is required"
				}
			}
		},
		description: {
			type: DataTypes.TEXT,
		},
		// JSONB is postgres only
		details: DataTypes.JSON,
		mixed: {
			type: DataTypes.BOOLEAN,
            defaultValue: false,
		},
		// Json can store arrays and objects, here we will store arrays
		links: {
			type: DataTypes.JSON,
		},
		references: {
			type: DataTypes.JSON,
		},
		untilTimeAccurate: {
			type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
		},
        until: DataTypes.DATE,
        updated: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        sequelize: conn,
        tableName: TABLE_NAME,
        modelName: TABLE_NAME,
    });
	
	return Model;
}
