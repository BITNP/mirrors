"use strict";
  // window.data = data; /* 将数据放到全局环境中保存起来，以便瀑布流模式加载 */

/* 加载数据, 默认加载9项 */
/* model */
/* 		0：全加载 */
/* 		1：瀑布流模式，num设置加载数，默认为9项, 从start处开始加载 */
function loadHTML(data, model = 1, num = 9, start = 0) {
  /* var html = ''; */
  var main_container = document.getElementById('main_container');
  if (model == 1) {
    var row = main_container.getElementsByClassName('row')[0];
    if (!row) {
      var div_row = document.createElement('div');
      div_row.className = "row";
      document.getElementById('main_container').appendChild(div_row);
      row = main_container.getElementsByClassName('row')[0];
    }
    for (var mir = start; mir < start + num && mir < data.length; mir++) {
      var Name = data[mir].path;
      var Img = Name + '.png';
			var div = '';
      div += '<div class="col-12 col-sm-12 col-md-4" id="item_0">';
      div += '<div class="card mb-4 mt-4 box-shadow mir-shadow">';
      div += '<img class="card-img-top" src="/img/' + Name + '.png" alt="Card image cap">';
      div += '<div class="card-body">';
      div += '<p class="card-text">' + Name + '</p>';
      div += '<nav class="nav nav-pills nav-fill">';
      div += '<a class="nav-item nav-link" href="javascript:(0);" name="' + Name + '">下载</a>';
      div += '<a class="nav-item nav-link" href="javascript:(0);" name="' + Name + '">帮助</a>';
      div += '</nav>';
      div += '</div>';
      div += '</div>';
      div += '</div>';
        console.log(div);
      row.innerHTML += div;
    }
  }
  addCilckActions();
}
/* 绑定鼠标单击事件 */
function addCilckActions() {
  $(".nav-link[name]").click(function() {
    console.log($(this).index());
    var name = $(this).attr("name");
    switch($(this).index()) {
      case 0: /*下载*/
      {
        var href = window.location.pathname;
        var hrefArr = href.split('/');
        href = href.substring(0, href.length - hrefArr[hrefArr.length - 1].length);
        href += name;
        window.location.href = href;
      }
      break;
      case 1: /*帮助*/
      {
        var href = window.location.pathname;
        var hrefArr = href.split('/');
        href = href.substring(0, href.length - hrefArr[hrefArr.length - 1].length);
        href += 'help/' + name;
        window.location.href = href;
      }
      break;
    }
  });
  $("#fankui").click(() => $(".erweima").css('display','flex'));
  $(".erweima").click(function(){
    $(this).hide();
  });
}
/* 瀑布流模式加载数据 */
window.onscroll = function() {
  if (checkLoad()) {
    var nodeNum = $("#main_container .row").children().length;
    loadHTML(data.datas, 1, 9, nodeNum);
  }
};
/* 瀑布流模式, 检查是否应该加载 */
function checkLoad() {
  var contentHeight = $(".col-md-4:last").offset().top;
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var pageHeight = document.documentElement.clientHeight || document.body.clientHeight;
  if (contentHeight < scrollTop + pageHeight) {
    return true;
  }
};