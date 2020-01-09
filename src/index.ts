export { SchemaConfig, SchemaFieldType, DatastoreService, datastoreService, ConnectionType, Connection } from 'myrmeke-colony';

export { MongoDatastore } from './instance/mongo.datastore';
export { MongoSchemaService } from './service/mongo-schema.service';

import { registerAlgorithm } from './service/mongo-connection.component';

registerAlgorithm();