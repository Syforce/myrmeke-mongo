import { DocumentQuery, Schema, Model, Connection } from 'mongoose';
import { AbstractDatastore, IDatastore, DatastoreService, ConnectionType, DynamicConnection,
	SchemaConfig, datastoreService } from 'myrmeke-colony';

import { MongoSchemaService } from '../service/mongo-schema.service';

export class MongoDatastore<T> extends AbstractDatastore<Connection> implements IDatastore<T> {
	private model: Model<any>;

	constructor(config: SchemaConfig) {
		super(config, new MongoSchemaService());
	}

	/**
	 * Start creating the model when the connection is created.
	 */
	protected init(): void {
		const schema: Schema = this.schemaService.generate(this.config);
		this.model = this.connection.getConnection().model(this.config.name, schema);

		console.log(`Registered datastore ${this.config.name}`);
	}

	protected getConnection(): DynamicConnection<any> {
		return datastoreService.getConnection(ConnectionType.MONGO_DB);
	}

	public observe(callback: DocumentQuery<any, any, any> | Promise<T | Array<T>>): Promise<T & Array<T>> {
		const promise: Promise<T & Array<T>> = callback instanceof Promise ? callback : callback.exec();

		return promise;
	}

	/**
	 * Get all the Models of type T from the database.
	 */
	public getAll(): Promise<Array<T>> {
		const query: DocumentQuery<any, any, any> = this.model.find();

		return this.observe(query);
	}

	/**
	 * Get a Model of type T by it's id.
	 */
	public getById(id: string | T): Promise<T> {
		const query: DocumentQuery<any, any, any> = this.model.findById(id);

		return this.observe(query);
	}

	/**
	 * Get a Model of type T by it's id and populate provided attributes.
	 */
	public getByIdPopulated(id: string, population: Array<string>): Promise<T> {
		const query: DocumentQuery<any, any, any> = this.model.findById(id).populate(population);

		return this.observe(query);
	}

	public getByIdAndUpdate(id: string, options: any) {
		const query: DocumentQuery<any, any, any> = this.model.findByIdAndUpdate(id, options);

		return this.observe(query);
	}

	public getByIdAndRemove(id: string): Promise<T> {
		const query: DocumentQuery<any, any, any> = this.model.findByIdAndDelete(id);

		return this.observe(query);
	}

	public getManyByIdsAndRemove(ids: Array<string>): Promise<Array<T>> {
		const promise: Promise<Array<T>> = new Promise<Array<T>>((resolve: Function, reject: Function) => {
			this.model.find({
				_id: {
					$in: ids
				}
			}).then((models: Array<T>) => {
				this.model.deleteMany({
					_id: {
						$in: ids
					}
				}).then(() => {
					resolve(models);
				});
			});
		});

		return promise;
	}

	/**
	 * Create a Model of type T and return it.
	 */
	public create(model: T): Promise<T> {
		const query: Promise<T> = this.model.create(model);

		return this.observe(query);
	}

	public updateById(id: string, options: any): Promise<any> {
		const query: DocumentQuery<any, any, any> = this.model.update({
			_id: id
		}, options);

		return this.observe(query);
	}

	public removeById(id: string): Promise<any> {
		const query: DocumentQuery<any, any, any> = this.model.remove({ _id: id });

		return this.observe(query);
	}

	public removeManyByIds(ids: Array<string>): Promise<any> {
		const query: DocumentQuery<any, any, any> = this.model.deleteMany({
			_id: {
				$in: ids
			}
		});

		return this.observe(query);
	}
}