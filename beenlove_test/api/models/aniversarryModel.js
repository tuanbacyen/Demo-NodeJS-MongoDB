'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var aniversarrySchema = new Schema({
    aniversarryid: {
        type: Number,
        unique: true,
        required: true
    },
    coupleid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    detail: String,
    date: Date,
    urlimage: String
}, {
    versionKey: false
});

aniversarrySchema.plugin(mongoosePaginate);

aniversarrySchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-aniversarryid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.aniversarryid !== 'undefined') ? model.aniversarryid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Aniversarries', aniversarrySchema);

module.exports = {
    field_json: function() {
        return ['aniversarryid', 'coupleid', 'name', 'detail', 'date', 'urlimage'];
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