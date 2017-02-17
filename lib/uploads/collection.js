import UploadsSchema from './schema';
import { _ } from 'meteor/underscore';

const Uploads = new Mongo.Collection('uploads');

Uploads.attachSchema(UploadsSchema);

export default Uploads;
