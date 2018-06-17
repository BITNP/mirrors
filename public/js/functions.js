/* 数据过滤器, 通过 url 参数过滤 */
function dataFilter(data){
  var filteredData = {};
  var length = 0;
  var oData = data.datas;
  filteredData.type = data.type;
  filteredData.datas = [];

  /* conditions */
  var query = requests['query'];
  var alphabet = requests['alphabet'];

  for(i in oData) {
    var mirName = oData[i].path?oData[i].path:oData[i].name;
    var isOK = true;
    if(query && mirName.indexOf(query) == -1) {
          isOK = false;
    }
    if(alphabet) 
    {
          var begin = alphabet.charAt(0);
          var end = alphabet.charAt(2);
          var code = mirName.charAt(0).toUpperCase();
          if(code < begin || code > end) isOK = false;
    }
    if(isOK) {
          filteredData.datas[length++] = oData[i];
    }
  }

  return filteredData;}


/* url 参数获取器 */
function GetRequest() {var url = location.search;var theRequest = new Object();if (url.indexOf("?") != -1) {var str = url.substr(1);strs = str.split("&");for(var i = 0; i < strs.length; i ++) {theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);}}return theRequest;}


/* url 跳转函数， 传入 url 参数 */
function UrlJump(request) {
  var href = window.location.pathname;
  if(request) {
    href += '?';
    for(i in request) {
      href += i + "=" + request[i];
      href += "&";
    }
    href = href.substring(0,href.length - 1);
  }
  window.location.href = href;}
  

/* 获取url参数 */
function GetQueryString(name) {

  if(arguments.length == 0) {
  var url = window.location.search;
    
    var reg = /([^\?&=]*)=([^&]*)/g;

    var r = url.match(reg);

    var result = {};

    if(r != null) {

      r.forEach((item, index)=>{

        let temp = item.split('=');

        result[temp[0]] = temp[1];

      });

    }

    return result;

  } else {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if (r != null) return unescape(r[2]);

    return null;

  }

}

/* 路径连接函数 */
function path_join(_path_1, file) {

  if(_path_1[_path_1.length - 1] == '/') {
    if(file == "../") {
      let path = _path_1.split('/');
      console.log(path);
      path.splice(path.length - 2, 2);
      console.log(path);
      return path.join('/');
    } else {
      return _path_1 + file;
    }
  } else {
    if(file == "../") {
      let path = _path_1.split('/');
      console.log(path)
      path.splice(path.length - 1, 1);
      console.log(path);
      return path.join('/');
    } else {
      return _path_1 + '/' + file;
    }
  }

}

/* 根据_href_config 来更新search， 并返回 href, 如果现有 search 中没有 _search_config 中提到的项，则添加到 search */
function update_search(_search_config) {
  let query_arr = GetQueryString();
  for(let attr in _search_config) {
    query_arr[attr] = _search_config[attr];
  }
  let search = "";
  for(let attr in query_arr) {
    search += attr + "=" + query_arr[attr] + "&";
  }
  return search.substring(0,search.length-1);
}


function getPageNav(_page, _num, _total) {
  let total_page_num = Math.ceil(_total / _num);
  var nav = [];
  if( _page != 1 ) nav.push({ name: "首页", link_page: update_search({ page: 1 }) });

  if( _page > 2 ) nav.push({ name: "上一页", link_page: update_search({ page: _page - 1 }) });

  if( _page > 3 ) nav.push({ name: "...", link_page: null });

  for(var i = _page - 2; i <= _page + 2; i++) {
    if(i > 0 && i <= total_page_num) {
      if(i == _page)
        nav.push({ name: i.toString(), link_page: null});
      else
        nav.push({ name: i.toString(), link_page: update_search({ page: i }) });
    }
  }

  if( total_page_num - _page > 3) nav.push({ name: "...", link_page: null});

  if( total_page_num - _page > 1) nav.push({ name: "下一页", link_page: update_search({ page: _page + 1 }) });

  if( total_page_num - _page > 0) nav.push({ name: "尾页", link_page: update_search({ page: total_page_num }) });

  return nav;
}
