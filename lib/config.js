const AWS_CONFIG = Meteor.settings.private.aws;

if (AWS_CONFIG) {
    AWS.config.update({
        accessKeyId: AWS_CONFIG.key,
        secretAccessKey: AWS_CONFIG.secret
    });
}
