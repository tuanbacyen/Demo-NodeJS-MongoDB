'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var requestLoveSchema = new Schema({
    requestloveid: {
        type: Number,
        unique: true,
        required: true
    },
    senderid: Number,
    receiveid: Number,
    state: String
}, {
    versionKey: false
});

requestLoveSchema.plugin(mongoosePaginate);

requestLoveSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-requestloveid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.requestloveid !== 'undefined') ? model.requestloveid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('RequestLoves', requestLoveSchema);

module.exports = {
    field_json: function() {
        return ['requestloveid', 'senderid', 'receiveid', 'state'];
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