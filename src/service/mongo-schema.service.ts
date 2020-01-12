import { Schema } from 'mongoose';
import { SchemaConfig, SchemaFieldConfig, SchemaFieldType, ISchemaService } from 'myrmeke-colony';

export class MongoSchemaService implements ISchemaService {
	public generate(config: SchemaConfig): Schema {
		const mongoSchemaOptions = {};

		config.fields.forEach((field: SchemaFieldConfig) => {
			mongoSchemaOptions[field.name] = this.getFieldType(field.type);
		});

		return new Schema(mongoSchemaOptions);
	}

	public getFieldType(type: SchemaFieldType) {
		switch (type) {
			case SchemaFieldType.STRING: {
				return Schema.Types.String;
			}
			case SchemaFieldType.INTEGER: {
				return Schema.Types.Number;
			}
		}

		return null;
	}
}