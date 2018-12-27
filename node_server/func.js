const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const properties = require('../properties.js');
const functions = {
	/**
	 * 根据指定的属性对对象数组进行拓展
	 * @param {Object Array} _arr_1         待拓展对象数组
	 * @param {Object Array} _arr_2         拓展对象数组
	 * @param {String} _property_name 拓展使用的属性
	 */
	Object_extend: (_arr_1, _arr_2, _property_name) => {

		let arr = _arr_1;

		// 用于标记已存在于 _arr_1 中的对应 _property_name 的值, 并将该值作为属性使用
		// 即将对象 _arr_property 当作关联数组使用
		let _arr_property = {};
		let _arr_1_len = _arr_1.length;
		for( let i = 0; i < _arr_1_len; i++ ) {
			// 取得 arr_1 中对应 property_name 属性的值
			let property_val = _arr_1[i][_property_name];
			
			// 将该值作为 _arr_property 的属性进行标记
			_arr_property[property_val] = 1;
		}

		// 对 _arr_2 进行遍历，并拓展进数组 arr
		var _arr_2_len = _arr_2.length;
		for( let i = 0; i < _arr_2_len; i++ ) {
			let property_val = _arr_2[i][_property_name];
			// 如果已存在该值
			if (_arr_property[property_val] === 1 ) {
				// nothing to do
			} else {
				// 将该对象拓展进数组 arr
				arr.push(_arr_2[i]);
			}
		}
		return arr;
	},
	/**
	 * 检测文件是否存在
	 * @param  {string} _path 文件路径
	 * @return {boolean}       存在为真，不存在为假
	 */
	fsExistsSync: (_path) => {
	    try{
	        fs.accessSync(_path, fs.F_OK);
	    }catch(e){
	        return false;
	    }
	    return true;
	},
	/**
	 * 过滤器
	 * @param  {Array} _datas 对象数组
	 * @param  {Object} _filter  过滤条件，目前支持三种过滤条件，字符属性过滤，数字属性过滤，日期属性过滤
	 * @return {Array}          过滤后的对象数组
	 */
	filter: (_datas, _filter) => {

		let filtered = [];
		let data_len = _datas.length;
		for(let i = 0; i < data_len; i++) {
			let flag = true;
			for(attr in _filter) {
				if(typeof _datas[i][attr] === "string") {
					var reg = new RegExp(_filter[attr]);
					// console.log(reg)
					if(!reg.test(_datas[i][attr])) {
						flag = false;
					}
				} else if(typeof _datas[i][attr] === "number") {
					if(!(_datas[i][attr] >= _filter[attr].start && _datas[i][attr] < _filter[attr].end)) {
						flag = false;
					}
				} else if(_datas[i][attr] instanceof Date) {
					if(!(Number(_datas[i][attr]) >= _filter[attr].start && Number(_datas[i][attr]) < _filter[attr].end)) {
						flag = false;
					}
				}
			}
			if(_datas[i].visibility == properties.privilige.hide) {
				flag = false;
			}
			if(flag) {
				filtered.push(_datas[i]);
			}
		}
		return filtered;
	},
	/**
	 * 文件遍历
	 * @param  {string} _path   遍历的路径
	 * @param  {function} getdata 自定义的数据处理函数,有两个参数，第一个是当前遍历的文件名，第二个是当前文件的信息
	 * @return {Array}         获取到的数据数组
	 */
	fileTraversal: (_path, getdata) => {

	  if(!functions.fsExistsSync(_path)) {
	    return -1;
	  }
	  var dirList = fs.readdirSync(_path);
	  var list = [];

	  dirList.forEach(function(item){
	    var handler = fs.statSync(path.join(_path, item));
		list.push(getdata(item, handler));
	  });
	  return list;
	},
	/**
	 * 读取文本文件
	 * @param  {string} filename 文件的路径
	 * @return {string}          读取结果
	 */
	readFile: (filename) => {

	    let filebuffer = fs.readFileSync(filename);
	    return iconv.decode(filebuffer, functions.getCodeType(filename));
	},
	/**
	 * 获取文件编码类型
	 * @param  {string} filename 文件的路径
	 * @return {string}          文件编码格式，可能取值为 unicode, utf8, gbk
	 */
	getCodeType(filename) {
	
	    let codeType = '';
	    let buffer = fs.readFileSync(filename);
	    if (buffer[0] == 0xff && buffer[1] == 0xfe) {
	        codeType = 'unicode';
	    } else if (buffer[0] == 0xfe && buffer[1] == 0xff) {
	        codeType = 'unicode';
	    } else if (buffer[0] == 0xef && buffer[1] == 0xbb) {
	        codeType = 'utf8';
	    } else {
	        codeType = 'gbk';
	    }
	    return codeType;
	}
}

module.exports = functions;
