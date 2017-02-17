import S3Uploader from './lib/s3';
import middleware from './extensions/busboy.middleware';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';


let postRoutes = Picker.filter(function (req, res) {
    return req.method == "POST";
});

postRoutes.middleware(middleware);

postRoutes.route('/upload/:token', function (params, req, res, next) {
    const { resourceType, resourceId } = req.postData;
    check(resourceType, String);
    check(resourceId, String);

    let response = {status: 200};

    const user = Meteor.users.findOne({
        'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(params.token)
    });

    if (!user) {
        response.status = 500;
    } else {
        _.each(req.filenames, function(filename) {
            const uploadedFile = S3Uploader.upload(filename);

            uploadedFile.save({
                resourceType,
                resourceId,
                user: user._id
            });
        });
    }

    res.end(JSON.stringify(response));
});
