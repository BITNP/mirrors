
const fs = require('fs');
const path = require('path');
const properties = require('../properties.js');
const file = properties.mirrors_json_path;
const func = require('./func.js');
/**
 * 获取镜像目录
 * @type {Object Array}
 */
var mirrors_data = [];


var mirror_request = JSON.parse(fs.readFileSync( properties.mirrors_request_path ));
// var mirrors_data = JSON.parse(fs.readFileSync( properties.mirrors_json_path ));

/**
 * 对镜像进行排序 优先name升序，其次last_update降序
 * @param  {Object} (_mirror_1, _mirror_2     两个存储镜像信息的对象
 * @return {Bool}             返回布尔比较值
 */
mirrors_data.sort((_mirror_1, _mirror_2) => {
	if(_mirror_1.name === _mirror_2.name) {
		return _mirror_2.last_update - _mirror_1.last_update;
	} else {
		return _mirror_1.name > _mirror_2.name;
	}
})


function Mirror() {


}


/**
 * 从指定开始位置获取一定数量的镜像对象, 当镜像数目不足时，读取到最后一个为止
 * @param  {int} _start 开始位置标记
 * @param  {int} _num   数量标记，设置为负数可返回99999999个镜像文件（即全部返回）
 * @return {Object}        对象，包含在指定条件下镜像列表中镜像的总数以及指定数量的镜像文件
 */
Mirror.prototype.addMirrorRequest = (_mirror_obj) => {
	mirror_request.push(_mirror_obj);
	// console.log(mirror_request)
	// 更新 helps.json
	fs.writeFile(properties.mirrors_request_path, JSON.stringify(mirror_request), 'utf-8', (err) => {
		if(err) {
			console.log(err);
			return;
		}
		console.log("The mirror_request has been synchronized to mirror_request.json");
	});
};

/**
 * 从指定开始位置获取一定数量的镜像对象, 当镜像数目不足时，读取到最后一个为止
 * @param  {int} _start 开始位置标记
 * @param  {int} _num   数量标记，设置为负数可返回99999999个镜像文件（即全部返回）
 * @return {Object}        对象，包含在指定条件下镜像列表中镜像的总数以及指定数量的镜像文件
 */
Mirror.prototype.getMirrors = (_start, _num) => {
	if(_start < 0) {
		_start = 0;
	}
	if (_num < 0) {
		_num = 99999999;
	}
	let _mirrors = [];
	let _mirror_data_len = mirrors_data.length;

	for(let i = _start; i < _mirror_data_len && i < _start + _num; i++) {
		_mirrors.push(mirrors_data[i]);
	}
	return {
		total: mirrors_data.length,
		mirrors_info: _mirrors
	};
};

/**
 * 带过滤器的镜像获取
 * @param  {int} _start  在经过过滤器过滤后的镜像列表中获取镜像的开始位置标记
 * @param  {int} _num    数量标记，设置为负数是可返回99999999个镜像文件（即全部返回）
 * @param  {Object} _filter 过滤器对象
 * @return {Object}         对象，包含在指定条件下镜像列表中镜像的总数以及指定数量的镜像文件
 */
Mirror.prototype.getWithFilter = (_start, _num, _filter) => {
	// console.log(_filter)
	var _mirrors_data;

	if(_filter.mirror_path) {
		// 获取镜像路径
		let _mirrors_path = path.join(properties.mirrors_path, _filter.mirror_path || "");
		// console.log(_mirrors_path)
		// 遍历文件系统获取镜像数据
		_mirrors_data = fileTraversal(_mirrors_path);
	} else {

		if(mirrors_data.length == 0) {
			mirror.synchronizeWithFileSystem();
		}
		_mirrors_data = mirrors_data;
	}
	_mirrors_data = func.filter(_mirrors_data, _filter);
	// console.log(_mirrors_data)

	if(_start < 0) {
		_start = 0;
	}

	if (_num < 0) {
		_num = 99999999;
	}

	let _mirrors = [];
	let _mirror_data_len = _mirrors_data.length;

	for(let i = _start; i < _mirror_data_len && i < _start + _num; i++) {
		_mirrors.push(_mirrors_data[i]);
	}

	return {
		total: _mirrors_data.length,
		mirrors_info: _mirrors
	};
};

/**
 * 将镜像目录与文件系统同步，参数为同步配置
 * @param  {Object} _config 同步配置选项
 * save_to_mirrors_json: 是否将同步更新到mirrors.json，默认为 false
 * save_current_visibility: 是否保留当前已存在于mirrors.json中的镜像的可见度, 默认为false,同步后默认所有镜像可见
 * @return {[type]} [description]
 */
Mirror.prototype.synchronizeWithFileSystem = function(_config = {}) {
	// 配置
	let config = {
		save_to_mirrors_json: _config.save_to_mirrors_json || false,
		save_current_config:_config.save_current_visibility || false
	}

	// 获取镜像路径
	let _mirrors_path = properties.mirrors_path;
	// 遍历文件系统获取镜像数据
	let _mirrors_data = fileTraversal(_mirrors_path);

	// 更新 mirrors_data
	if(config.save_current_visibility) {
		mirrors_data = func.Object_extend(mirrors_data, _mirrors_data, "name");
	} else {
		mirrors_data = _mirrors_data;
	}

	// 更新 mirrors.json
	if(config.save_to_mirrors_json) {
		fs.writeFile(properties.mirrors_json_path, JSON.stringify(mirrors_data), 'utf-8', (err) => {
			if(err) {
				console.log(err);
				return;
			}
			console.log("The mirrors_data has been synchronized to morrors.json");
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



var mirror = new Mirror();

mirror.synchronizeWithFileSystem();

module.exports = mirror;