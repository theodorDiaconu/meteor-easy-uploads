import Uploads from './uploads/collection';

export default class {
    constructor(name, path, mimeType) {
        this.name = name;
        this.path = path;
        this.mimeType = mimeType;
        this.thumbs = {};
    }

    addThumb(size, path) {
        this.thumbs[`${size}x${size}`] = path;
    }

    save({
        resourceType,
        resourceId,
        userId
    }) {
        Uploads.insert({
            path: this.path,
            name: this.name,
            mimeType: this.mimeType,
            thumbs: this.thumbs,
            resourceType,
            resourceId,
            userId
        })
    }
}