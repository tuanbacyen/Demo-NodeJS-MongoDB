'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var garellySchema = new Schema({
    garellyid: {
        type: Number,
        unique: true,
        required: true
    },
    coupleid: String,
    aniversarryid: Number,
    urlimage: String
}, {
    versionKey: false
});

garellySchema.plugin(mongoosePaginate);

garellySchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-garellyid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.garellyid !== 'undefined') ? model.garellyid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Garellies', garellySchema);

module.exports = {
    field_json: function() {
        return ['garellyid', 'coupleid', 'aniversarryid', 'urlimage'];
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

            if (props[j] === 'urlimage') {
                new_model[props[j]] = utils.galleryURL(new_model[props[j]], domain);
            }
        }
        return new_model;
    }
}