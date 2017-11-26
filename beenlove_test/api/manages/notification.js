'use strict';

var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Notifications = mongoose.model('Notifications');

// push notification iOS
var apn = require('../manages/apn');

// push notification Android


//
function saveNotification(senderid, message, type, dataJSON) {
    Users.findOne({ 'userid': senderid }, function(err, model) {
        if (err || model == null) return;

        Users.find({ 'coupleid': model.coupleid }, function(err, models) {
            if (err || models == null || models.length == 0) return;

            var receiveid = 0;
            for (var i = 0; i < models.length; i++) {
                if (models[i].userid != senderid) {
                    receiveid = models[i].userid;
                    break;
                }
            }

            if (receiveid > 0) {
                Notifications.findIdMax(function(err, idMax) {
                    var notiModel = new Notifications({
                        notificationid: idMax,
                        senderid: senderid,
                        receiveid: receiveid,
                        message: message,
                        type: type,
                        dataJSON: JSON.stringify(dataJSON),
                        date: new Date()
                    });

                    notiModel.save(function(err, model) {
                        if (err || models == null || models.length == 0) return;

                        console.log('add notification success');
                    });
                });
            }
        });
    });
}

function saveRequestNotification(senderid, receiveid, message, type, dataJSON) {
    Notifications.findIdMax(function(err, idMax) {
        var notiModel = new Notifications({
            notificationid: idMax,
            senderid: senderid,
            receiveid: receiveid,
            message: message,
            type: type,
            dataJSON: JSON.stringify(dataJSON),
            date: new Date()
        });

        notiModel.save(function(err, model) {
            if (err || model == null || model.length == 0) return;

            console.log('add notification success');
        });
    });
}

module.exports = {
    anivesarryCreate: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'add aniversarry', Notifications.aniversarryAdd, { 'aniversarryid': task_id });
    },

    anivesarryUpdate: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'update aniversarry', Notifications.aniversarryUpdate, { 'aniversarryid': task_id });
    },

    anivesarryDelete: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'delete aniversarry', Notifications.aniversarryDelete, { 'aniversarryid': task_id });
    },

    anivesarryAddImage: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'add image in aniversarry', Notifications.aniversarryAddImage, { 'aniversarryid': task_id });
    },

    anivesarryDeleteImage: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'delete image in aniversarry', Notifications.aniversarryDeleteImage, { 'aniversarryid': task_id });
    },

    eventCreate: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'create event', Notifications.eventAdd, { 'eventid': task_id });
    },

    eventUpdate: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'update event', Notifications.eventUpdate, { 'eventid': task_id });
    },

    eventDelete: function(user_id_send, task_id = null) {
        saveNotification(user_id_send, 'delete event', Notifications.eventDelete, { 'eventid': task_id });
    },

    requestLove: function(senderid, receiveid, task_id = null) {
        saveRequestNotification(senderid, receiveid, 'request love', Notifications.requestLove, { 'task_id': task_id });
    },

    requestLoveAccept: function(userid, requestloveid) {
        saveRequestNotification(userid, 0, 'accept request', Notifications.requestLoveAccept, { 'user_id_send': userid, 'requestloveid': requestloveid });
    },

    requestLoveCancel: function(userid, requestloveid) {
        saveRequestNotification(userid, 0, 'cancel request', Notifications.requestLoveCancel, { 'user_id_send': userid, 'requestloveid': requestloveid });
    }

}