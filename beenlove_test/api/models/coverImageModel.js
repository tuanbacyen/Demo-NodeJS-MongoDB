'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var coverImageSchema = new Schema({
    coverimage_id: {
        type: Number,
        unique: true,
        required: true
    },
    coverimage_name: String,
    coverimage_url: String
}, {
    versionKey: false
});

coverImageSchema.plugin(mongoosePaginate);

coverImageSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-coverimage_id')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.coverimage_id !== 'undefined') ? model.coverimage_id : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('CoverImages', coverImageSchema);

module.exports = {
    field_json: function() {
        return ['coverimage_id', 'coverimage_name', 'coverimage_url'];
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