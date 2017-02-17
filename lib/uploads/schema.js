import ThumbsSchema from './thumbsSchema';

export default new SimpleSchema({
    name: {
        type: String
    },

    resourceId: {
        type: String
    },

    resourceType: {
        type: String
    },

    userId: {
        type: String,
        optional: true
    },

    mimeType: {
        type: String
    },

    path: {
        type: String
    },

    thumbs: {
        type: ThumbsSchema,
        optional: true
    },

    uploadedAt: {
        type: Date,
        optional: true
    }
});