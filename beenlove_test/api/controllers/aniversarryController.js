'use strict';

var mongoose = require('mongoose'),
    Aniversarries = mongoose.model('Aniversarries'),
    Garellies = mongoose.model('Garellies'),
    notification = require('../manages/notification.js');

var utils = require('../manages/utils');

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

//--------------------------------------------------------------------------------
function errorHandler(res, err) {
    res.json({
        status: KSTATUS_ERROR,
        message: err,
        indexNext: -1,
        result: null
    });
}


//--------------------------------------------------------------------------------
exports.list = function(req, res) {
    var pageOb = utils.pageObject(req.body.index, req.body.limit);
    var query = Aniversarries.find({ 'coupleid': req.body.coupleid }).sort('-aniversarryid');

    Aniversarries.paginate(query, {
        page: pageOb.index,
        limit: pageOb.limit
    }, function(err, result) {
        if (err) {
            errorHandler(res, err);
        } else {
            // remove _id field & ensure has enough key in Schema
            var userModel = require('../models/aniversarryModel');
            var resultSearch = new Array();
            for (var i = 0; i < result['docs'].length; i++) {
                var item = userModel.castModel(result['docs'][i]);
                item.urlimage = utils.coverImageURL(item.urlimage, utils.hostURL(req));
                resultSearch.push(item);
            }

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Success',
                indexNext: result['page'] < result['pages'] ? result['page'] + 1 : -1,
                result: resultSearch
            });
        }
    });
};

exports.detail = function(req, res) {
    var aniversarryid = parseInt(req.body.aniversarryid);

    Garellies.find({ aniversarryid: aniversarryid }, function(err, result) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });
        } else {
            // remove _id field & ensure has enough key in Schema
            var userModel = require('../models/galleryModel');
            var resultSearch = new Array();
            for (var i = 0; i < result.length; i++) {
                var item = userModel.castModel(result[i], utils.hostURL(req));
                resultSearch.push(item);
            }

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Success',
                result: resultSearch
            });
        }
    });
};

exports.create = function(req, res) {
    var new_task = new Aniversarries(req.body);

    Aniversarries.findIdMax(function(err, idMax) {
        if (err) {
            errorHandler(res, err);
        } else {
            new_task.aniversarryid = idMax;
            new_task.save(function(err, model) {
                if (err) {
                    res.json({
                        status: KSTATUS_ERROR,
                        message: err,
                        result: null
                    });
                    return;
                }

                notification.anivesarryCreate(req.body.user_id_send, model.aniversarryid);

                //
                var userModel = require('../models/aniversarryModel');
                var userRe = userModel.castModel(model);

                userRe.urlimage = utils.coverImageURL(userRe.urlimage, utils.hostURL(req));

                res.json({
                    status: KSTATUS_SUCCESS,
                    message: 'Create aniversarry success',
                    result: userRe
                });
            });
        }
    });
};

exports.update = function(req, res) {
    var query = { 'aniversarryid': req.body.aniversarryid };
    var param = req.body;
    delete param['coupleid']; // don't replace coupleid

    Aniversarries.findOneAndUpdate(query, param, { new: true }, function(err, doc) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });
        } else if (doc == null) {
            res.json({
                status: KSTATUS_ERROR,
                message: 'Don\'t exists aniversarryid',
                result: null
            });
        } else {
            notification.anivesarryUpdate(req.body.user_id_send, doc.aniversarryid);

            var userModel = require('../models/aniversarryModel');
            var userRe = userModel.castModel(doc, utils.hostURL(req));
            userRe.urlimage = utils.coverImageURL(userRe.urlimage, utils.hostURL(req));

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Update aniversarry success',
                result: userRe
            });
        }
    });
};

exports.addGallery = function(req, res) {
    var upload = utils.mUploadGallery().array('listimage');
    upload(req, res, function(err) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });
            return;
        }

        Aniversarries.find({ 'aniversarryid': req.body.aniversarryid }, function(err, model) {
            if (err) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: err,
                    result: null
                });
            } else if (model.length === 0) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: 'Error: Don\'t exists aniversarry',
                    result: null
                });
            } else if (req.files.length === 0) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: 'Error: Need to add a minimum file',
                    result: null
                });
            } else {
                var coupleid = model[0].coupleid;

                //console.log(req.files);

                Garellies.findIdMax(function(err, idMax) {
                    var listInsert = [];
                    for (var i = 0; i < req.files.length; i++) {
                        var model = {
                            garellyid: idMax + i,
                            coupleid: coupleid,
                            aniversarryid: parseInt(req.body.aniversarryid),
                            urlimage: req.files[i].filename
                        }
                        listInsert.push(model);
                    }

                    Garellies.collection.insert(listInsert, function(err, docs) {
                        if (err) {
                            res.json({
                                status: KSTATUS_ERROR,
                                message: err,
                                result: null
                            });
                        } else {
                            notification.anivesarryAddImage(req.body.user_id_send, req.body.aniversarryid);

                            // remove _id field & ensure has enough key in Schema
                            var userModel = require('../models/galleryModel');
                            var result = new Array();
                            for (var i = 0; i < docs.ops.length; i++) {
                                var item = userModel.castModel(docs.ops[i], utils.hostURL(req));
                                result.push(item);
                            }

                            res.json({
                                status: KSTATUS_SUCCESS,
                                message: 'Add gallery success',
                                result: result
                            });
                        }
                    });
                });
            }
        });
    })
};

exports.deleteGallery = function(req, res) {
    Garellies.remove({ garellyid: req.body.garellyid }, function(err, obj) {
        if (err) {
            errorHandler(res, err);
        } else if (obj.result.n === 0) {
            errorHandler(res, 'Garellies: garellyid was not found');
        } else {
            notification.anivesarryDeleteImage(req.body.user_id_send);

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Delete garelly success'
            });
        }
    });
};

exports.delete = function(req, res) {
    // remove all Garellies
    var aniversarryid = parseInt(req.body.aniversarryid);
    Garellies.remove({ aniversarryid: aniversarryid }, function(err, obj) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err
            });
        }

        // remove Aniversarries
        Aniversarries.remove({ aniversarryid: req.body.aniversarryid }, function(err, obj) {
            if (err) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: err
                });
            } else if (obj.result.n === 0) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: 'Aniversarries: aniversarryid was not found'
                });
            } else {
                notification.anivesarryDelete(req.body.user_id_send, req.body.aniversarryid);

                res.json({
                    status: KSTATUS_SUCCESS,
                    message: 'Delete aniversarry success'
                });
            }
        });
    });
};