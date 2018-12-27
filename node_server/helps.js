
const fs = require('fs');
const path = require('path');
const properties = require('../properties.js');
const func = require('./func.js');
const file = properties.help_json_path;
/**
 * 获取帮助目录
 * @type {Object Array}
 */
// var helps_data = [];
var helps_data = JSON.parse(fs.readFileSync( properties.helps_json_path ));

/**
 * 对帮助进行排序 优先name升序，其次last_update降序
 * @param  {Object} (_help_1, _help_2     两个存储帮助信息的对象
 * @return {Bool}             返回布尔比较值
 */
helps_data.sort((_help_1, _help_2) => {
	if(_help_1.name === _help_2.name) {
		return _help_2.last_update - _help_1.last_update;
	} else {
		return _help_1.name > _help_2.name;
	}
})


function Help() {

}


Help.prototype.addHelp = function(_help_obj) {
	let help_exist = help.getHelp(_help_obj.name);
	if(help_exist.help_info.name) {
		return properties.error_code.help_exist;
	}

	let help_info = {
			"name": _help_obj.name,
			"author": _help_obj.author,
			"last_update": _help_obj.last_update,
			"image": _help_obj.image,
			"brief_intro": _help_obj.brief_intro,
			"visibility": properties.privilige.show
		};

	helps_data.push(help_info);
	// console.log(helps_data)
	// 更新 helps.json
	fs.writeFile(properties.helps_json_path, JSON.stringify(helps_data), 'utf-8', (err) => {
		if(err) {
			console.log(err);
			return;
		}
		console.log("The helps_data has been synchronized to helps.json");
	});

	// 写入markdown文件
	fs.writeFileSync(path.join(properties.helps_md_folder, help_info.name + '.md'), _help_obj.help_md, 'utf-8');
	
};	

/**
 * 由帮助文档名获取帮助文档
 * @param  {string} _name 文档名
 * @return {Object}       文档信息
 */
Help.prototype.getHelp = function(_name) {
	
	let _help_info = {};
	let _help_md = "";
	
	// 如果帮助文件缓存里没有值，则先读取
	if(helps_data.length == 0) {
		JSON.parse(fs.readFileSync( properties.helps_json_path ));
	}

	let _helps_data_len = helps_data.length;

	for(let i = 0; i < _helps_data_len; i++) {
		if(helps_data[i].name == _name) {
			_help_info = helps_data[i];
		}
	}

	if(_help_info.name) {
		_help_md = func.readFile(path.join(properties.helps_path, _help_info.name + '.md'));
	}

	return {
		help_info: _help_info,
		help_md: _help_md
	}
};

/**
 * 带过滤器的帮助获取
 * @param  {int} _start  在经过过滤器过滤后的帮助列表中获取帮助的开始位置标记
 * @param  {int} _num    数量标记，设置为负数是可返回99999999个帮助文件（即全部返回）
 * @param  {Object} _filter 过滤器对象
 * @return {Object}         对象，包含在指定条件下帮助列表中帮助的总数以及指定数量的帮助文件
 */
Help.prototype.getWithFilter = (_start, _num, _filter) => {

	var _helps_data;

	// if(_filter.help_path) {
	// 	// 获取帮助路径
	// 	let _helps_path = path.join(properties.helps_path, _filter.help_path || "");
		
	// 	// 遍历文件系统获取帮助数据
	// 	_helps_data = fileTraversal(_helps_path);
	// } else {
	// 	_helps_data = helps_data;
	// }

	if(helps_data.length == 0) {
		helps_data = JSON.parse(fs.readFileSync( properties.helps_json_path ));
	}

	_helps_data = helps_data;

	// console.log(_helps_data)

	_helps_data = func.filter(_helps_data, _filter);

	// console.log(_helps_data)

	if(_start < 0) {
		_start = 0;
	}

	if (_num < 0) {
		_num = 99999999;
	}

	let _helps = [];
	let _help_data_len = _helps_data.length;

	for(let i = _start; i < _help_data_len && i < _start + _num; i++) {
		_helps.push(_helps_data[i]);
	}
	return {
		total: _helps_data.length,
		helps_info: _helps
	};
};


// /**
//  * 从指定开始位置获取一定数量的帮助对象, 当帮助数目不足时，读取到最后一个为止
//  * @param  {int} _start 开始位置标记
//  * @param  {int} _num   数量标记，设置为负数可返回99999999个帮助文件（即全部返回）
//  * @return {Object}        对象，包含在指定条件下帮助列表中帮助的总数以及指定数量的帮助文件
//  */
// Help.prototype.getHelps = (_start, _num) => {
// 	if(_start < 0) {
// 		_start = 0;
// 	}
// 	if (_num < 0) {
// 		_num = 99999999;
// 	}
// 	let _helps = [];
// 	let _help_data_len = helps_data.length;

// 	for(let i = _start; i < _help_data_len && i < _start + _num; i++) {
// 		_helps.push(helps_data[i]);
// 	}
// 	return {
// 		total: helps_data.length,
// 		helps_info: _helps
// 	};
// };


/**
 * 将帮助目录与文件系统同步，参数为同步配置
 * @param  {Object} _config 同步配置选项
 * save_to_helps_json: 是否将同步更新到helps.json，默认为 false
 * save_current_visibility: 是否保留当前已存在于helps.json中的帮助的可见度, 默认为false,同步后默认所有帮助可见
 * @return {[type]} [description]
 */
Help.prototype.synchronizeWithFileSystem = function(_config = {}) {
	// 配置
	let config = {
		save_to_helps_json: _config.save_to_helps_json || false,
		save_current_config:_config.save_current_visibility || false
	}

	// 获取帮助路径
	let _helps_path = properties.helps_path;
	
	// 遍历文件系统获取帮助数据
	let _helps_data = fileTraversal(_helps_path);

	// 更新 helps_data
	if(config.save_current_visibility) {
		helps_data = func.Object_extend(helps_data, _helps_data, "name");
	} else {
		helps_data = _helps_data;
	}

	// 更新 helps.json
	if(config.save_to_helps_json) {
		fs.writeFile(properties.helps_json_path, JSON.stringify(helps_data), 'utf-8', (err) => {
			if(err) {
				console.log(err);
				return;
			}
			console.log("The helps_data has been synchronized to morrors.json");
		});
	}
};


function fileTraversal(_path){

  return func.fileTraversal(_path, (item, handler) => {
	var obj = {};
	obj.name = item;
	obj.last_update = handler.mtime;
	obj.size = handler.size;
	obj.type = "file";
	if(handler.isDirectory())
		obj.type = "directory";
	return obj;
  });

}


var help = new Help();

// help.synchronizeWithFileSystem();

module.exports = help;