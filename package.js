Package.describe({
    name: 'app:uploads',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({
    'imagemagick': '0.1.3'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.1');
    api.use('ecmascript');

    var packages = [
        'app:lib',
        'peerlibrary:aws-sdk@2.2.42',
        'mrt:fancybox@0.5.0',
        'meteorhacks:picker',
        'shammar13:busboy'
    ];

    api.use(packages);
    api.imply(packages);

    api.mainModule('main.client.js', 'client');
    api.mainModule('main.server.js', 'server');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('app:uploads');
    api.addFiles('uploads-tests.js');
});
