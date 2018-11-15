const bodyParser = require('body-parser');
const marked = require('marked');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const http = require('http')
const request = require('request')






const properties = require('../properties.js');

var upload = multer({
    dest: properties.image_upload_folder
});

var mirror = require('./mirrors');
var help = require('./helps');

var month_letter = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
    'May', 'June', 'July', 'Aug.',
    'Sept.', 'Oct.', 'Nov.', 'Dec.'
];

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

routes = function () {
    var externalRoutes = require('express').Router();

    externalRoutes.use(bodyParser.urlencoded({
        extended: true
    }));

    externalRoutes.use(bodyParser.json());


    /* 静态资源 */
    externalRoutes.get('/css/*', (req, res) => {
        res.sendFile(req.originalUrl, {
            'root': './'
        });
    });

    externalRoutes.get('/js/*', (req, res) => {
        res.sendFile(req.originalUrl, {
            'root': './'
        });
    });

    externalRoutes.get('/iamges/*', (req, res) => {
        res.sendFile(req.originalUrl, {
            'root': './'
        });
    });

    externalRoutes.get('/_help/*', (req, res) => {
        res.sendFile(req.originalUrl, {
            'root': './'
        });
    });
    /* 静态资源 */

    externalRoutes.get('/', function (req, res) {
        res.status(200);
        res.render('mirror', {
            title: "北理镜像站 | 镜像列表",
            pagejs: ['mirrorTemplate.js', 'page_navTemplate.js', 'mirror.js', 'filter.js']
        });
    });

    // externalRoutes.get('/admin', function(req, res) {
    //     res.status(200);
    //     res.render('admin',{
    //         title: "北理镜像站 || 管理员",
    //         pagejs: ["admin.js"]
    //     });
    // });

    externalRoutes.route('/submit_mirror')
        .get((req, res) => {
            res.status(200);
            res.render('submit_mirror', {
                title: "北理镜像站 | 提交镜像",
                pagejs: ['submit_mirror.js']
            });
        })
        .post((req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            var mirror_obj = {
                name_id: req.body.name_id,
                qq: req.body.qq,
                wechat: req.body.wechat,
                tel: req.body.tel,
                mirror_name: req.body.mirror_name,
                mirror_link: req.body.mirror_link,
                message: req.body.message,
            }

            mirror.addMirrorRequest(mirror_obj);
            res.json({
                msg: "您的镜像添加请求已上传"
            });
            res.end();
        });

    externalRoutes.get('/submit_help', (req, res) => {
        res.status(200);
        res.render('submit_help', {
            title: "北理镜像站 | 提交帮助",
            pagejs: ['imageupload.js', 'submit_help.js']
        });
    })
    externalRoutes.post('/submit_help', upload.single('myfile'), (req, res) => {
        var file = req.file;
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        console.log("名称：%s", file.originalname);
        console.log("mime：%s", file.mimetype);
        console.log('name_id: ' + req.body.name_id);
        console.log('code: ' + req.body.code);
        console.log('help_name: ' + req.body.help_name);
        console.log('help_brief: ' + req.body.help_brief);
        console.log('help_content: ' + req.body.help_content);

        if (req.body.code == properties.help_upload_access_code) {
            //以下代码得到文件后缀
            name = file.originalname;
            nameArray = name.split('');
            var nameMime = [];
            l = nameArray.pop();
            nameMime.unshift(l);
            while (nameArray.length != 0 && l != '.') {
                l = nameArray.pop();
                nameMime.unshift(l);
            }
            //Mime是文件的后缀
            Mime = nameMime.join('');
            // console.log(Mime);
            //重命名文件 加上文件后缀
            fs.renameSync(path.join(properties.image_upload_folder, file.filename), path.join(properties.helps_image_folder, req.body.help_name + Mime));

            let help_obj = {
                "name": req.body.help_name || "无名",
                "author": req.body.name_id || "匿名",
                "last_update": Number(new Date()),
                "image": req.body.help_name + Mime,
                "brief_intro": req.body.help_brief || "主人很懒，没有写简介qaq",
                "help_md": req.body.help_content
            }

            var ret = help.addHelp(help_obj);
            if (ret == properties.error_code.help_exist) {
                res.send('{"err": "文档名重复"}');
            } else {
                res.send(JSON.stringify(help_obj));
            }
        } else {
            res.send(JSON.stringify({
                "err": "上传准入码有误"
            }));
        }

        res.end();

    });

    externalRoutes.route('/helps')
        .get((req, res) => {
            res.status(200);
            res.render('helps', {
                title: "北理镜像站 | 帮助列表",
                pagejs: ['helpTemplate.js', 'page_navTemplate.js', 'helps.js', 'filter.js']
            });
        })
        .post((req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            var start = parseInt(req.body.start);
            var num = parseInt(req.body.num);
            var filter = req.body.filter;
            var data = [];
            if (filter) {
                if (typeof filter === "string") {
                    filter = JSON.parse(filter);
                }
                data = help.getWithFilter(start, num, filter);
            } else {
                data = help.getHelps(start, num);
            }
            res.json({
                status: 200,
                total: data.total,
                helps_info: data.helps_info
            });
            res.end();
        });


    externalRoutes.route('/help_single')
        .get((req, res) => {
            console.log("GET /help_single")
            console.log(req.query.help_name)
            var _help = help.getHelp(req.query.help_name || "default");
            var myDate = new Date(_help.help_info.last_update);
            var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var month = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            var date = myDate.getDate(); //获取当前日(1-31) 

            res.status(200);
            res.render('help_single', {
                title: "北理镜像站 | 镜像列表",
                pagejs: ['showdown.min.js', 'help_single.js'],
                pagecss: ['github-markdown.css'],
                year: year,
                month: month_letter[month],
                date: date,
                help_name: _help.help_info.name,
                help_author: _help.help_info.author,
                help_image: _help.help_info.image,
                help_brief: _help.help_info.brief_intro,
                help_md: marked(_help.help_md)
            });
        })
        .post((req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            var name = req.body.name;
            var data = help.getHelp(name);
            res.json({
                status: 200,
                help_info: data.help_info,
                help_md: data.help_md
            });
            res.end();
        });


    externalRoutes.route('/mirror')
        .get((req, res) => {
            res.status(200);
            res.render('mirror', {
                title: "北理镜像站 | 镜像列表",
                pagejs: ['mirrorTemplate.js', 'page_navTemplate.js', 'mirror.js', 'filter.js']
            });
        })
        .post((req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');

            // var obj = {
            //     start: (_page - 1) * _num,
            //     num: _num,
            //     filter: {
            //         type: GetQueryString("type"),
            //         mirror_path: GetQueryString("path"),
            //         name: GetQueryString("name"),
            //         size: {
            //             start: GetQueryString("size_start") || 0,
            //             end: GetQueryString("size_end") || 1e20
            //         },
            //         last_update: {
            //             start: GetQueryString("last_update_start") || 0,
            //             end: GetQueryString("last_update_end") || 1e20
            //         }
            //     }
            // }


            request.get('http://localhost:8888' + req.body.filter.mirror_path,{}, function(err, data) {
                // console.log(data)
                // let sendData = data.body.match(/\<pre\>.*/)
                // console.log(data.body)
                let start = data.body.indexOf('<pre>')
                let end = data.body.indexOf('</pre>')
                let sendData = data.body.substring(start, end + 6)
                // console.log(sendData)
                res.json({data: sendData})
            })





            // var start = parseInt(req.body.start);
            // var num = parseInt(req.body.num);
            // var filter = req.body.filter;
            // var data = [];
            // if (filter) {
            //     if (typeof filter === "string") {
            //         filter = JSON.parse(filter);
            //     }
            //     data = mirror.getWithFilter(start, num, filter);
            // } else {
            //     data = mirror.getMirrors(start, num);
            // }
            // res.json({
            //     status: 200,
            //     total: data.total,
            //     mirrors_info: data.mirrors_info
            // });
            // res.end();
        });

    /* 尝试对其他目录返回文件，如果文件不存在，则返回404 */

    externalRoutes.get('/*', (req, res) => {
        res.sendFile(req.originalUrl, {
            'root': './mirror/'
        }, (err) => {
            res.status(404);
            res.render('404', {
                title: "北理镜像站"
            })
        });
    });

    return externalRoutes;
};

module.exports = routes();