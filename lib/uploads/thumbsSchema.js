import thumbs from '../static/thumbs';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
let schema = {};

thumbs.forEach(size => {
    schema[`${size}x${size}`] = {
        type: String,
        optional: true
    }
});

export default new SimpleSchema(schema);