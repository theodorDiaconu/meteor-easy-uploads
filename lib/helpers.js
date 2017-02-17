const path = function(key) {
    return Meteor.settings["public"].aws.url + '/' + key;
};

Template.registerHelper('s3', path);

export { path }
