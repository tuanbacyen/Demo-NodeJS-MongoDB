'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

// type = 1: Request love
// 201: Event add, 202: Event update, 203: Event delete
// 301: Aniversarry add, 302: Aniversarry update, 303: Aniversarry delete, 304: Aniversarry add image, 305: Aniversarry delete image
var notificationSchema = new Schema({
    notificationid: {
        type: Number,
        unique: true,
        required: true
    },
    senderid: Number,
    receiveid: Number,
    message: String,
    date: Date,
    type: Number,
    dataJSON: String
}, {
    versionKey: false
});

notificationSchema.plugin(mongoosePaginate);

notificationSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-notificationid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.notificationid !== 'undefined') ? model.notificationid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Notifications', notificationSchema);

module.exports.requestLove = 101;
module.exports.requestLoveAccept = 102;
module.exports.requestLoveCancel = 103;
module.exports.eventAdd = 201;
module.exports.eventUpdate = 202;
module.exports.eventDelete = 203;
module.exports.aniversarryAdd = 301;
module.exports.aniversarryUpdate = 302;
module.exports.aniversarryDelete = 303;
module.exports.aniversarryAddImage = 304;
module.exports.aniversarryDeleteImage = 305;

module.exports = {
    field_json: function() {
        return ['notificationid', 'senderid', 'receiveid', 'message', 'date', 'type', 'dataJSON'];
    },

    castModel: function(model, domain = null) {
        if (model == null) { return null; }

        var utils = require('../manages/utils.js');
        var new_model = {};
        var props = this.field_json();
        for (var j = 0; j < props.length; j++) {
            new_model[props[j]] = "";
            if (typeof model[props[j]] !== 'undefined') {
                new_model[props[j]] = model[props[j]];
            }

        }
        return new_model;
    }
}