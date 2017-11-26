'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var chatboxSchema = new Schema({
    chatid: {
        type: Number,
        unique: true,
        required: true
    },
    coupleid: String,
    senderid: Number,
    receiveid: Number,
    messenger: String,
    date: Date
}, {
    versionKey: false
});

chatboxSchema.plugin(mongoosePaginate);

chatboxSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-chatid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.chatid !== 'undefined') ? model.chatid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Chatboxs', chatboxSchema);

module.exports = {
    field_json: function() {
        return ['chatid', 'coupleid', 'senderid', 'receiveid', 'messenger', 'date'];
    },

    castModel: function(model) {
        if (model == null) { return null; }
        
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