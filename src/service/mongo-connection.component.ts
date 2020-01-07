import { Mongoose, Connection } from 'mongoose';
import { DynamicConnection, ConnectionType, Connection as ConnectionConfig } from 'myrmeke-colony';

function callAlgorithm(connectionConfig: ConnectionConfig): Promise<any> {
	const promise: Promise<any> = new Promise((resolve: Function, reject: Function) => {
		const mongooseInstance: Mongoose = new Mongoose();

		mongooseInstance.createConnection(`mongodb://${connectionConfig.host}/${connectionConfig.host}`, {
			useNewUrlParser: true
		}).then((connection: Connection) => {
			console.log('MongoDB connection succeded');
			resolve(connection);
		}, (error) => {
			console.error('MongoDB connection failed', error);
			reject(error);
		});
	});

	return promise;
}

export function registerAlgorithm() {
	DynamicConnection.addAlgorithm(ConnectionType.MONGO_DB, callAlgorithm);
}