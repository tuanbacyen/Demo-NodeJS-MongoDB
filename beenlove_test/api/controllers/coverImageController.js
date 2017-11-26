'use strict';

var utils = require('../manages/utils.js');

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
exports.getconverimages = function(req, res) {
    var result = [];
    if (req.body.type == 1) {
        // cover image
        var sourceImage = ['bg_aniversary_0007_01.png', 'bg_aniversary_0006_02.png', 'bg_aniversary_0005_03.png', 'bg_aniversary_0004_04.png',
            'bg_aniversary_0003_05.png', 'bg_aniversary_0002_06.png', 'bg_aniversary_0001_07.png', 'bg_aniversary_0000_08.png'
        ];

        for (var i = 0; i < sourceImage.length; i++) {
            var obj = {
                coverimageid: i + 1,
                coverimagename: sourceImage[i],
                coverimageurl: utils.coverImageURL(sourceImage[i], utils.hostURL(req)),
                coverimagetype: req.body.type
            };

            result.push(obj);
        }
    } else {
        // background image
        var sourceImage = ['wallpaper__0008_01.png', 'wallpaper__0007_02.png', 'wallpaper__0006_03.png', 'wallpaper__0005_04.png',
            'wallpaper__0004_05.png', 'wallpaper__0003_06.png', 'wallpaper__0002_07.png', 'wallpaper__0001_08.png'
        ];

        for (var i = 0; i < sourceImage.length; i++) {
            var obj = {
                coverimageid: i + 1,
                coverimagename: sourceImage[i],
                coverimageurl: utils.backgroundURL(sourceImage[i], utils.hostURL(req)),
                coverimagetype: req.body.type
            };

            result.push(obj);
        }
    }

    res.json({
        status: KSTATUS_SUCCESS,
        message: 'Success',
        result: result
    });
};

exports.getemojis = function(req, res) {
    var result = [];

    var sourceImage = ['_0008_emoji_chickenlove_01.png', '_0007_emoji_chickenlove_02.png', '_0006_emoji_chickenlove_03.png', '_0005_emoji_chickenlove_04.png',
        '_0004_emoji_chickenlove_05.png', '_0003_emoji_chickenlove_06.png', '_0002_emoji_chickenlove_07.png', '_0001_emoji_chickenlove_08.png', '_0000_emoji_chickenlove_09.png'
    ];

    for (var i = 0; i < sourceImage.length; i++) {
        var obj = {
            emojiid: i + 1,
            emojiname: sourceImage[i],
            emojiurl: utils.emojiURL(sourceImage[i], utils.hostURL(req)),
            groupemojiid: 1
        };

        result.push(obj);
    }

    res.json({
        status: KSTATUS_SUCCESS,
        message: 'Success',
        result: [{
            groupemojiid: 1,
            groupemojiname: 'Basic',
            item: result
        }]
    });
};