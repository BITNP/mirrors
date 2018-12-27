"use strict";

var _page = parseInt(GetQueryString('page'));
var _num = parseInt(GetQueryString('num'));
var mirror_obj = []

if (!_page) { _page = 1 }

if (!_num) { _num = 10 }

// 获取镜像
// let get_url = 'http://localhost:9090'
let get_url = 'http://119.27.160.45:9090'
if (GetQueryString("path")) {
  get_url += GetQueryString("path")
}
$.ajax(get_url, {
  type: 'GET'
}).then((data) => {
  console.log('/mirror')
  if(typeof data === "string") {
    data = JSON.parse(data)
  }
  console.log("data", data)

  mirror_obj = data.mirrors
  console.log("mirror_obj: ", mirror_obj)



  // 加载镜像
  loadMirrors()
  console.log("mirror_show:", mirror_show)

  // 加载字母分类
  // loadAlphabetCategory(mirror_show)

}, (data) => {
  console.log(data)
});

// 处理分页
$("#selectPageSize span").click(function () {
  console.log($(this).attr('value'))
  let pageSize = $(this).attr('value')
  _num = pageSize
  let mirror_show = mirror_obj
  // 如果当前显示页面没有镜像，就修改 _page
  if (mirror_obj.length - (_page - 1) * _num < 0) {
    if(mirror_obj.length % _num === 0) {
      _page = parseInt(mirror_obj.length/_num)
    } else {
      _page = parseInt(mirror_obj.length/_num) + 1
    }
  }

  // 加载镜像
  loadMirrors()
})


$('#btn-search').click(function () {
  UrlJump({
    "query": $("#input-query").val()
  });
});
$("#input-query").keydown(function (e) {
  switch (e.keyCode) {
    case 13:
      UrlJump({
        "query": $("#input-query").val()
      });
      break;
    default:
      break
  }
});

// 加载镜像
function loadMirrors() {
  // 要显示的镜像
  let data = []

  // 正则过滤
  data = filterByRegex(mirror_obj, GetQueryString("name"))

  // 数据排序，将目录排在文件前面，然后按照先数字再字母，然后字母升序
  data = sortMirrors(data)

  // 数据分页
  data = data.slice((_page - 1) * _num, _page * _num)

  // 添加返回上一级目录项
  data = [{
    type: "directory",
    size: 0,
    name: "../",
    last_update: "0"
  }].concat(data)

  let html = []
  for (let i = 0; i < data.length; i++) {
    let osize = data[i].size
    let size = 0
    if (osize < 1024)
      size = osize + ' B';
    else if (osize < 1024 * 1024)
      size = (osize / 1024).toFixed(2) + ' KB';
    else if (osize < 1024 * 1024 * 1024)
      size = (osize / 1024 / 1024).toFixed(2) + ' MB';
    else
      size = (osize / 1024 / 1024 / 1024).toFixed(2) + ' GB';

    html.push(`<tr type="${data[i].type}"><td>${data[i].name}</td><td>${size}</td><td class="md-hidden-xs">${data[i].last_update}</td><td>-</td></tr>`)
  }

  // 加载镜像信息到页面上
  $("#mirrors").html(html.join(""));

  // 给每一个镜像绑定点击事件
  $("#mirrors tr").each((index, element) => {
    $(element).click(() => {
      let type = $(element).attr("type");
      switch (type) {
        case "file":
          {
            let _path = GetQueryString("path");
            let filename = $(element).find("td").eq(0).text();
            window.location.href = path_join(_path || "", filename);
          }
          break;
        case "directory":
          {
            let _path = GetQueryString("path");
            let filename = $(element).find("td").eq(0).text();
            window.location.search = update_search({
              path: path_join(_path || "", filename),
              page: 1,
              num: 10,
              name: ''
            });
          }
          break;
        default:
          break;
      }
    });
  });

  // 加载导航
  loadPageNav()

  // 更新页眉当前页信息显示
  refreshCurrentPageInfo()
}

// 加载导航
function loadPageNav() {

  // 获取导航数据
  var data = getPageNav(_page, _num, mirror_obj.length);
  console.log("pageNav: ", data)
  // {name: "尾页", link_page: "path=&page=2"}
  let html = []
  for (let i = 0; i < data.length; i++) {
    // html.push(`<li><a href="?${data[i].link_page}" >${data[i].name}</a></li>`)
    html.push(`<li><a onclick="loadPage(${data[i].page})" href="javascript:void(0);">${data[i].name}</a></li>`)
  }
  $("#page_nav").html(html.join(""));

}

function loadPage (page) {
  console.log("page", page)
  if (page) {
    _page = page
    
    loadMirrors()
  }
  return false;
}

// 正则过滤
function filterByRegex(data, regexStr) {
  if (regexStr && regexStr.length > 0) {
    let ret = []
    let regex = new RegExp(regexStr)
    for (let i = 0; i < data.length; i++) {
      if (regex.test(data[i].name)) {
        ret.push(data[i])
      }
    }
    return ret
  } else {
    return data
  }
}

/*  加载网页内容 */
function loadHTML(data) {
  console.log(data);
  /*  NavDatas数组，用于生成字母导航，第27个数字是镜像总数 */
  var navDatas = [];
  for (var i = 0; i <= 26; i++) {
    navDatas[i] = 0;
  }
  var row = 0;
  if (window.location.pathname != '/mirror' && window.location.pathname != '/mirror/') {
    var tr_first = '<tr id="tr_first"><td>上级目录</td><td>-</td><td class="md-hidden-xs">-</td><td>-</td></tr>';
    document.getElementById("mirrors").innerHTML = tr_first;
  }
  if (data == -1) {
    var tr_not_found = '<tr id="tr_not_found"><td>当前目录不存在</td><td>-</td><td class="md-hidden-xs">-</td><td>-</td></tr>';
    document.getElementById("mirrors").innerHTML = tr_not_found;
  } else {
    for (var mir = 0; mir < data.length; mir++) {
      var name = data[mir].path;
      var type = data[mir].type;
      var osize = parseInt(data[mir].size);
      var mtime = data[mir].mtime;
      var size = null;
      /*  更新NavDatas数组 */
      navDatas[name.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)]++;
      if (osize < 1024) size = osize + ' B';
      else if (osize < 1024 * 1024) size = (osize / 1024).toFixed(2) + ' KB';
      else if (osize < 1024 * 1024 * 1024) size = (osize / 1024 / 1024).toFixed(2) + ' MB';
      else size = (osize / 1024 / 1024 / 1024).toFixed(2) + ' GB';
      var tr = null;
      if (type == "file") {
        tr = '<tr type="' + type + '"><td>' + name + '</td><td>' + size + '</td><td class="md-hidden-xs">' + mtime + '</td><td>-</td></tr>';
      } else {
        let hasHelp = data[mir].help;
        let helpHTML = hasHelp ? '<button class="btn" name="gotoHelp" onclick="gotoHelp()">查看帮助文档</button>' : '-';
        tr = '<tr type="' + type + '"><td>' + name + '</td><td>' + '-' + '</td><td class="md-hidden-xs">' + '-' + '</td><td>' + helpHTML + '</td></tr>';
      }
      document.getElementById("mirrors").innerHTML += tr;
    }
    $('#mirrors tr').not("#tr_first").each(function () {
      $(this).find('td:lt(3)').on("click",
        function () {
          var href = window.location.pathname;
          if (href == "/mirror") href = '';
          href += '/' + $(this).parent().find(":eq(0)").text();
          /* if($(this).parent().attr("type") == 'file') */
          /*   href += "?type=file"; */
          window.location.href = href;
        });
    });
    $("button[name='gotoHelp']").each(function () {
      $(this).on('click', function () {
        var href = window.location.origin;
        href += '/help/' + $(this).parent().parent().find('td').eq(0).text();
        window.location.href = href;
      });
    });
    showNavbar(navDatas);
  }
  $("#tr_first").click(function () {
    var path = window.location.pathname;
    var pathParts = path.split('/');
    var href = window.location.origin;
    if (pathParts[pathParts.length - 1].match(/^\s$/) || pathParts[pathParts.length - 1] == '') pathParts.pop();
    pathParts.pop();
    var pathAppend = pathParts.join('/');
    // console.log(pathAppend);
    if (pathAppend == "") pathAppend = '/mirror';
    // console.log(pathAppend);
    window.location.href = href + pathAppend;
  });

}

function showall() {
  _page = 1
  _num = mirror_obj.length
  loadMirrors()
  console.log("showall")
}

function gotoHelp() {
  var href = window.location.origin;
  href += '/help/' + $(this).parent().parent().find('td').eq(0).text();
  window.location.href = href;
}

/*  navDatas 是一个数组，26个值，分别对应A-Z出现次数，不分大小写 */
function showNavbar(navDatas) {
  var html = "";
  var total = navDatas[26]; /*  获取镜像总数 */
  var average = Math.ceil(total / 5);
  var begin = 0;
  var end = 0;
  var tmp = 0;
  while (end < 26) {
    tmp += navDatas[end];
    if (tmp >= average && tmp) {
      if (begin == end) {
        html += '<li class="nav-item"><a class="nav-link" id="' + String.fromCharCode(begin + 65) + '-' + String.fromCharCode(end + 65) + '" href="javascript:void(0)">' + String.fromCharCode(begin + 65) + '(' + tmp + ')</a></li>';
      } else {
        html += '<li class="nav-item"><a class="nav-link" id="' + String.fromCharCode(begin + 65) + '-' + String.fromCharCode(end + 65) + '" href="javascript:void(0)">' + String.fromCharCode(begin + 65) + '-' + String.fromCharCode(end + 65) + '(' + tmp + ')</a></li>';
      }
      tmp = 0;
      begin = end + 1;
    }
    end++;
  }
  if (begin == 25) {
    html += '<li class="nav-item"><a class="nav-link" id="Z-Z" href="javascript:void(0)">Z(' + tmp + ')</a></li>';
  }
  $("ul.nav").append(html);
  $("ul.nav li").click(function () {
    var alphabet = $(this).find('a').attr("id");
    UrlJump({
      "alphabet": alphabet
    });
  });
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}

// 加载字母分类
function loadAlphabetCategory(_data) {
  let alphabet_table = [];

  _data.forEach((item) => {
    if (!alphabet_table[item.name[0].toUpperCase()]) {
      alphabet_table[item.name[0].toUpperCase()] = 1;
    } else {
      alphabet_table[item.name[0].toUpperCase()]++;
    }
  });

  console.log(alphabet_table)
  return alphabet_table
}

// 更新页眉当前页信息显示
function refreshCurrentPageInfo() {
  $('.start').text((_page - 1) * _num + 1);
  $('.end').text((_page * _num > mirror_obj.length) ? mirror_obj.length : _page * _num);
  $('.total').text(mirror_obj.length);
}

// 数据排序，将目录排在文件前面，然后按照先数字再字母，然后字母升序
function sortMirrors (mirrors) {
  return mirrors.sort((_mirror_1, _mirror_2) => {
    if (_mirror_1.type == _mirror_2.type) {
      if (_mirror_1.name > _mirror_2.name) {
        return 1
      } else if (_mirror_1.name < _mirror_2.name) {
        return -1
      } else {
        return 0
      }
    } else {
      if (_mirror_1.type == "directory") {
        return -1
      } else {
        return 1
      }
    }
  })
}

// $("#btn_help").click(function () {
//   let host = window.location.origin;
//   let path = "help";
//   console.log(host + ',' + path);
//   window.location.href = host + '/' + path;
// });


// var requests = null;
// var host = window.location.origin;
// $("#title-index").attr("href", host);

// // 给string添加两个判断函数
// /* 判断当前字符串是否以str开始 */
// if (typeof String.prototype.startsWith != 'function') {
//   String.prototype.startsWith = function (str) {
//     return this.slice(0, str.length) == str;
//   };
// }
// /* 判断当前字符串是否以str结束 */
// if (typeof String.prototype.endsWith != 'function') {
//   String.prototype.endsWith = function (str) {
//     return this.slice(-str.length) == str;
//   };
// }

// requests = GetRequest();
/* 根据文件目录生成导航 */
// var path = window.location.pathname;
// var path = GetQueryString('path');
// var pathParts = path.split('/');
// console.log("pathParts: ", pathParts)
// for (var item in pathParts) {
//   if (pathParts[item] != "") {
//     var btn = document.createElement('button');
//     btn.type = 'button';
//     btn.className = 'btn btn-secondary';
//     btn.innerText = pathParts[item] + ' /';
//     var pathNav = document.getElementById('pathNav');
//     pathNav.appendChild(btn);
//   }
// }
/*  点击导航按钮执行跳转 */
// $('#pathNav button').each(function () {
//   var path = "";
//   $(this).click(function () {
//     console.log($(this).prevAll().length);
//     var index = $(this).prevAll().length;
//     for (var i = 0; i < index; i++) {
//       path += $('#pathNav button').eq(i).text();
//     }
//     path += $('#pathNav button').eq(index).text();
//     path = path.replace(/ /g, "");
//     var href = '/' + path;
//     console.log(href);
//     window.location.href = href.substring(0, href.length - 1);
//   });
// });
