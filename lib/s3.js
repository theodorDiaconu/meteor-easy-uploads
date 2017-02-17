import { AWS } from 'meteor/peerlibrary:aws-sdk';
import UploadedFile from './UploadedFile';
import thumbs from './static/thumbs';
import mimeTypes from './static/mimeTypes';

let AWS_CONFIG = Meteor.settings.private.aws;
let S3 = new AWS.S3({
    region: AWS_CONFIG.region
});

export default class Uploader {
    static remove(key) {
        return S3.deleteObjectSync({
            Bucket: AWS_CONFIG.bucket,
            Key: key
        })
    }

    static getObject(key) {
        return S3.getObjectSync({
            Bucket: AWS_CONFIG.bucket,
            Key: key
        });
    }

    static putObject(fileKey, mimeType, stream) {
        let params = {
            Bucket: AWS_CONFIG.bucket,
            Key: fileKey,
            Body: stream,
            ContentType: mimeType
        };

        return S3.uploadSync(params);
    }

    static generateS3Key(filename, context) {
        if (context == null) {
            context = '';
        }
        let dateFolders = moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD');
        let key = dateFolders + '/' + Random.id();

        if (context !== '') {
            key += '-' + context;
        }

        if (Meteor.isDevelopment) {
            key = 'dev/' + key;
        }

        return key + '-' + filename;
    }

    static isImage(filename) {
        return Uploader.guessMimeType(filename).search('image') !== -1;
    }

    static guessMimeType(fileName) {
        let path = Npm.require("path");
        let ext = (path.extname(fileName).slice(1)).toLowerCase();

        return mimeTypes[ext] || 'text/plain';
    }

    static upload(filePath, fileKey) {
        let fs = Npm.require('fs');
        let os = Npm.require("os");
        let stream = fs.readFileSync(filePath);
        let fileName = filePath.replace(os.tmpDir() + '/', '');

        if (!fileKey) {
            fileKey = Uploader.generateS3Key(fileName);
        }

        const mimeType =  Uploader.guessMimeType(fileKey);
        Uploader.putObject(fileKey, mimeType, stream);

        const uploadedFile = new UploadedFile(fileName, fileKey, mimeType);

        if (Uploader.isImage(filePath)) {
            thumbs.forEach(size => {
                const thumbPath = Uploader.crop(filePath, size);

                uploadedFile.addThumb(size, thumbPath);
            });
        }

        fs.unlinkSync(filePath);

        return uploadedFile;
    }

    static crop(filePath, sizeType) {
        let im = Npm.require('imagemagick');
        let fs = Npm.require('fs');
        let os = Npm.require("os");
        let path = Npm.require("path");
        let fileName = filePath.replace(os.tmpDir() + '/', '');
        let fn = Meteor.wrapAsync(im.resize);

        let stdout = fn({
            srcData: fs.readFileSync(filePath, 'binary'),
            width: sizeType,
            format: path.extname(fileName).slice(1)
        });

        let buffer = new Buffer(stdout, 'binary');
        let keyThumb = 'thumb' + sizeType.toString() + 'x' + sizeType.toString();
        let key = Uploader.generateS3Key(fileName, keyThumb);

        Uploader.putObject(key, Uploader.guessMimeType(filePath), buffer);

        return key;
    }
};