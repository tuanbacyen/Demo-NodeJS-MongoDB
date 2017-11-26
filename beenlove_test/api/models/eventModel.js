'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var eventSchema = new Schema({
    eventid: {
        type: Number,
        unique: true,
        required: true
    },
    coupleid: {
        type: String,
        required: true
    },
    name: String,
    date: Date,
    alterday: String,
    emoticon: String
}, {
    versionKey: false
});

eventSchema.plugin(mongoosePaginate);

eventSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-eventid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.eventid !== 'undefined') ? model.eventid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Events', eventSchema);

module.exports = {
    field_json: function() {
        return ['eventid', 'coupleid', 'name', 'date', 'alterday', 'emoticon'];
    },

    castModel: function(model, domain = null) {
        if (model == null) { return null; }
        
        var new_model = {};
        var props = this.field_json();
        var utils = require('../manages/utils');
        
        for (var j = 0; j < props.length; j++) {
            new_model[props[j]] = "";
            if (typeof model[props[j]] !== 'undefined') {
                new_model[props[j]] = model[props[j]];
            }

            if (props[j] === 'emoticon') {
                new_model[props[j]] = utils.emojiURL(new_model[props[j]], domain);
            }
        }
        return new_model;
    }
}