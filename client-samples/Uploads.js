import { Uploads } from 'meteor/app:uploads';

Template.TaskUploads.onCreated(function () {
    return this.subscribe('task.uploads', {
        taskId: this.data.task._id
    });
});

Template.TaskUploads.onRendered(function () {
    return $('#gallery a.fancybox').fancybox({
        type: "image"
    });
});

Template.TaskUploads.helpers({
    uploads: function () {
        return Uploads.find({
            resourceType: 'task',
            resourceId: this.task._id
        });
    },
    isImage: function () {
        var ref = this.mimeType;

        return ref === 'image/png' || ref === 'image/gif' || ref === 'image/jpg' || ref === 'image/jpeg';
    },
    thumb: function () {
        return this.thumbs['256x256'];
    },
    dropzoneData: function () {
        const taskId = this.task._id;

        return {
            url: '/upload/' + Accounts._storedLoginToken(),
            maxFiles: 10,
            multiple: true,
            id: 'taskUpload',
            accept: function (file, done) {
                return done();
            },
            sending: function (file, xhr, formData) {
                formData.append('resourceType', 'task');
                formData.append('resourceId', taskId);
            },
            complete: function (file) {
                if (file.status === 'error') {
                    return Notifications.error('An error occured with your upload.');
                }

                return $(file.previewElement).fadeOut();
            }
        };
    }
});

Template.TaskUploads.events({
    'click .delete-file': function (e, tpl) {
        e.preventDefault();
        let id = $(e.currentTarget).data('id');

        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this file.",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Delete",
            closeOnConfirm: true
        }, () => {
            Meteor.call('tasks.delete_upload', id, function () {
                return Notifications.success('Deleted file');
            });
        });
    }
});
