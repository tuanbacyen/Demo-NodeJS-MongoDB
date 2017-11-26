'use strict';

module.exports = {
    initServer: function() {
        // create folder publics and folder resource if not exists
        var fs = require('fs');
        var publicsDir = './api/publics';

        if (!fs.existsSync(publicsDir)){
            fs.mkdirSync(publicsDir);
        }

        var avartar = publicsDir + '/avartar';
        if (!fs.existsSync(avartar)){
            fs.mkdirSync(avartar);
        }

        var gallery = publicsDir + '/gallery';
        if (!fs.existsSync(gallery)){
            fs.mkdirSync(gallery);
        }

        var cover = publicsDir + '/cover';
        if (!fs.existsSync(cover)){
            fs.mkdirSync(cover);
        }

        var background = publicsDir + '/background';
        if (!fs.existsSync(background)){
            fs.mkdirSync(background);
        }

        var emoji = publicsDir + '/emoji';
        if (!fs.existsSync(emoji)){
            fs.mkdirSync(emoji);
        }
    },

    pageObject: function(index, limit) {
        const LIMIT_MAX = 50;
        var limit_1 = (typeof limit === 'undefined') ? 20 : parseInt(limit);
        var index_1 = (typeof index === 'undefined' || index == '0') ? 1 : parseInt(index);

        return {
            limit: limit_1 > LIMIT_MAX ? LIMIT_MAX : limit_1,
            index: index_1
        };
    },

    castModel: function(model, props) {
        var new_user = {};
        for (var j = 0; j < props.length; j++) {
            new_user[props[j]] = "";
            if (typeof model[props[j]] !== 'undefined') {
                new_user[props[j]] = model[props[j]];
            }
        }
        return new_user;
    },

    avartaUpload: function() {
        return {
            'prefix': '/avartar',
            'path': 'api/publics/avartar/'
        };
    },

    galleryUpload: function() {
        return {
            'prefix': '/gallery',
            'path': 'api/publics/gallery/'
        };
    },

    coverImageUpload: function() {
        return {
            'prefix': '/cover',
            'path': 'api/publics/cover/'
        };
    },

    backgroundUpload: function() {
        return {
            'prefix': '/background',
            'path': 'api/publics/background/'
        };
    },

    emojiUpload: function() {
        return {
            'prefix': '/emoji',
            'path': 'api/publics/emoji/'
        };
    },

    mUploadAvarta: function() {
        var path = this.avartaUpload().path;
        var multer = require('multer');
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, path)
            },
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '_' + Date.now())
            }
        });

        return multer({ storage: storage });
    },

    mUploadGallery: function() {
        var path = this.galleryUpload().path;
        var multer = require('multer');
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, path)
            },
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '_' + Date.now())
            }
        });

        return multer({ storage: storage });
    },

    avartaURL: function(name, domain) {
        if (name.length === 0) {
            return null
        }
        
        return domain + this.avartaUpload().prefix + '/' + name;
    },

    galleryURL: function(name, domain) {
        if (name.length === 0) {
            return null
        }
        
        return domain + this.galleryUpload().prefix + '/' + name;
    },

    coverImageURL: function(name, domain) {
        if (name.length === 0) {
            return null
        }
        
        return domain + this.coverImageUpload().prefix + '/' + name;
    },

    backgroundURL: function(name, domain) {
        if (name.length === 0) {
            return null
        }
        
        return domain + this.backgroundUpload().prefix + '/' + name;
    },

    emojiURL: function(name, domain) {
        if (name.length === 0) {
            return null
        }
        
        return domain + this.emojiUpload().prefix + '/' + name;
    },

    generatorCoupleID: function() {
        var uniqid = require('uniqid');
        return uniqid();
    },

    stringEmpty: function(val) {
        return typeof val === 'undefined' || val.trim() === '';
    },

    hostURL: function(reqest) {
        return reqest.protocol + '://' + reqest.get('host');
    }

}