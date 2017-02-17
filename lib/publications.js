import Uploads from './uploads/collection';

Meteor.publish('uploads', function(filters) {
    if (filters == null) {
        filters = {};
    }

    return Uploads.find(filters);
});