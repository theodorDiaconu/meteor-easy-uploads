import Uploads from './collection';
import Uploader from '../s3';

Uploads.before.insert(function(userId, doc) {
    doc.uploadedAt = new Date();
    doc.userId = userId;
});

Uploads.after.remove(function(userId, doc) {
    Meteor.defer(() => {
        Uploader.remove(doc.path);
        if (_.keys(doc.thumbs).length > 0) {
            _.each(doc.thumbs, (path) => {
                Uploader.remove(path);
            })
        }
    })
});
