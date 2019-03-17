"use strict";

var _page = parseInt(GetQueryString('page'));
var _num = parseInt(GetQueryString('num'));

if(!_page) {
  _page = 1;
}

if(!_num) {
  _num = 10;
}

jQuery(function($){
  var BASE_DIR = '/web';

  $.ajax(BASE_DIR+'/mirror', {
      data: {
        start: (_page - 1) * _num,
        num: _num,
        filter: {
          type: GetQueryString("type"),
          mirror_path: GetQueryString("path"),
          name: GetQueryString("name"),
          size: {
            start: GetQueryString("size_start") || 0,
            end: GetQueryString("size_end") || 1e20
          },
          last_update: {
            start: GetQueryString("last_update_start") || 0,
            end: GetQueryString("last_update_end") || 1e20
          }
        }
      },
      dataType: 'json',
      type: 'POST'
  }).then((data) => {
    console.log(data);
    $('.start').text( (_page - 1) * _num + 1 );
    $('.end').text( (_page * _num > data.total) ? data.total : _page * _num );
    $('.total').text( data.total );

    var page_nav_data = getPageNav(_page, _num, data.total);
    // console.log(page_nav_data)
    var nav_content = Handlebars.templates.page_nav({ data: page_nav_data });
    // console.log(nav_content)
    $("#page_nav").html(nav_content);

    // 数据排序，将目录排在文件前面，然后按照先数字再字母，然后字母升序
    data.mirrors_info = data.mirrors_info.sort((_mirror_1, _mirror_2) => {
      if(_mirror_1.type ==  _mirror_2.type) {
        return _mirror_1.name > _mirror_2.name;
      } else {
        return _mirror_1.type > _mirror_2.type;
      }
    })
    console.log(data.mirrors_info)
    // 加载字母分类
    // loadAlphabetCategory(data.mirrors_info);
    data.mirrors_info = [{
      type: "directory",
      size: 0,
      name: "../",
      last_update: "0"
    }].concat(data.mirrors_info);
    var mirrors_content = Handlebars.templates.mirror({data:data.mirrors_info});
    var _page_num = Math.ceil(data.total / _num);


    // 加载镜像
    $("#mirrors").html(mirrors_content);

    // 绑定点击事件
    $("#mirrors tr").each((index, element) => {
      $(element).click(() => {
        let type = $(element).attr("type");
        switch(type) {
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
              path: path_join(_path || "", filename)
            });
          }
          break;
          default:
          break;
        }
      });
    });


  },(data) => {
    console.log(data)
  });

  var requests = null;
  var host = window.location.origin;
    $("#title-index").attr("href", host);
    /* 判断当前字符串是否以str开始 */
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
      };
    }　　　　
    /* 判断当前字符串是否以str结束 */
    if (typeof String.prototype.endsWith != 'function') {
      String.prototype.endsWith = function(str) {
        return this.slice( - str.length) == str;
      };
    }
    requests = GetRequest();
    /* 根据文件目录生成导航 */
    var path = window.location.pathname;
    var pathParts = path.split('/');
  //   for (var item in pathParts) {
  //     if (pathParts[item] != "") {
  //       var btn = document.createElement('button');
        // btn.type = 'button';
        // btn.className = 'btn btn-secondary';
        // btn.innerText = pathParts[item] + ' /';
        // var pathNav = document.getElementById('pathNav');
        // pathNav.appendChild(btn);
  //     }
  //   }
    $('#btn-search').click(function() {UrlJump({"query": $("#input-query").val()});});
    $("#input-query").keydown(function(e) {switch (e.keyCode) {case 13:UrlJump({"query":$("#input-query").val()});break;default:break}});
    $("#btn_help").click(function(){
      let host = window.location.origin;
      let path = "help";
      console.log(host + ',' + path);
      window.location.href = host + '/' + path;
    });
    /*  点击导航按钮执行跳转 */
    $('#pathNav button').each(function() {
      var path = "";
      $(this).click(function() {
        console.log($(this).prevAll().length);
        var index = $(this).prevAll().length;
        for (var i = 0; i < index; i++) {
          path += $('#pathNav button').eq(i).text();
        }
        path += $('#pathNav button').eq(index).text();
        path = path.replace(/ /g, "");
        var href = '/' + path;
        console.log(href);
        window.location.href = href.substring(0, href.length - 1);
      });
    });






    /*  加载网页内容 */
    function loadHTML(data) {
      console.log(data);
      /*  NavDatas数组，用于生成字母导航，第27个数字是镜像总数 */
      var navDatas = [];
      for (var i = 0; i <= 26; i++) {
        navDatas[i] = 0;
      }
      var row = 0;
      if(window.location.pathname != BASE_DIR+'/mirror' && window.location.pathname != BASE_DIR+'/mirror/') {
        var tr_first = '<tr id="tr_first"><td>上级目录</td><td>-</td><td class="md-hidden-xs">-</td><td>-</td></tr>';
        document.getElementById("mirrors").innerHTML = tr_first;
      }
      if(data == -1) {
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
          navDatas[name.toUpperCase().charCodeAt(0)-'A'.charCodeAt(0)]++;
          if (osize < 1024) 										size = osize + ' B';
          else if (osize < 1024 * 1024) 				size = (osize / 1024).toFixed(2) + ' KB';
          else if (osize < 1024 * 1024 * 1024) 	size = (osize / 1024 / 1024).toFixed(2) + ' MB';
          else 																	size = (osize / 1024 / 1024 / 1024).toFixed(2) + ' GB';
          var tr = null;
          if(type == "file") {
            tr = '<tr type="' + type + '"><td>' + name + '</td><td>' + size + '</td><td class="md-hidden-xs">' + mtime + '</td><td>-</td></tr>';
          } else {
            let hasHelp = data[mir].help;
            let helpHTML = hasHelp?'<button class="btn" name="gotoHelp" onclick="gotoHelp()">查看帮助文档</button>':'-';
            tr = '<tr type="' + type + '"><td>' + name + '</td><td>' + '-' + '</td><td class="md-hidden-xs">' + '-' + '</td><td>' + helpHTML + '</td></tr>';
          }
          document.getElementById("mirrors").innerHTML += tr;
        }
        $('#mirrors tr').not("#tr_first").each(function() {
          $(this).find('td:lt(3)').on("click",
          function() {
            var href = window.location.pathname;
            if (href == BASE_DIR+"/mirror") href = '';
            href += '/' + $(this).parent().find(":eq(0)").text();
            /* if($(this).parent().attr("type") == 'file') */
            /*   href += "?type=file"; */
            window.location.href = href;
          });
        });
        $("button[name='gotoHelp']").each(function(){
          $(this).on('click',function(){
            var href = window.location.origin;
            href += '/help/' + $(this).parent().parent().find('td').eq(0).text();
            window.location.href = href;
          });
        });
        showNavbar(navDatas);
      }
      $("#tr_first").click(function(){
        var path = window.location.pathname;
        var pathParts = path.split('/');
        var href = window.location.origin;
        if(pathParts[pathParts.length-1].match(/^\s$/) || pathParts[pathParts.length-1] == '') pathParts.pop();
        pathParts.pop();
        var pathAppend = pathParts.join('/');
        // console.log(pathAppend);
        if(pathAppend == "") pathAppend = BASE_DIR+'/mirror';
        // console.log(pathAppend);
        window.location.href = href + pathAppend;
      });

    }

  function gotoHelp() {
    var href = window.location.origin;
    href += '/help/' + $(this).parent().parent().find('td').eq(0).text();
    window.location.href = href;
  }


    /*  navDatas 是一个数组，26个值，分别对应A-Z出现次数，不分大小写 */
    function showNavbar(navDatas){
      var html = "";
      var total = navDatas[26]; /*  获取镜像总数 */
      var average = Math.ceil(total/5);
      var begin = 0;
      var end = 0;
      var tmp = 0;
      while(end < 26) {
        tmp += navDatas[end];
        if (tmp >= average && tmp) {
          if (begin == end) {
            html += '<li class="nav-item"><a class="nav-link" id="'+String.fromCharCode(begin+65)+'-'+String.fromCharCode(end+65)+'" href="javascript:void(0)">'+String.fromCharCode(begin+65)+'('+tmp+')</a></li>';
          }
          else
          {
            html += '<li class="nav-item"><a class="nav-link" id="'+String.fromCharCode(begin+65)+'-'+String.fromCharCode(end+65)+'" href="javascript:void(0)">'+String.fromCharCode(begin+65)+'-'+String.fromCharCode(end+65)+'('+tmp+')</a></li>';
          }
          tmp = 0;
          begin = end + 1;
        }
        end++;
      }
      if (begin == 25) {
        html += '<li class="nav-item"><a class="nav-link" id="Z-Z" href="javascript:void(0)">Z('+tmp+')</a></li>';
      }
      $("ul.nav").append(html);
      $("ul.nav li").click(function(){
        var alphabet = $(this).find('a').attr("id");
        UrlJump({"alphabet":alphabet});
      });
    }




    // // 加载字母分类
    // function loadAlphabetCategory(_data) {
    //   let alphabet_table = [];

    //   _data.forEach((item) => {
    //     if(!alphabet_table[item.name[0].toUpperCase()]) {
    //       alphabet_table[item.name[0].toUpperCase()] = 1;
    //     } else {
    //       alphabet_table[item.name[0].toUpperCase()] ++;
    //     }
    //   });

    //   console.log(alphabet_table)
    // }
});