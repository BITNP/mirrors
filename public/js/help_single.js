    	"use strict";
    	var requests = GetRequest();


      $.ajax('http://localhost:3000/help_single', {
          data: {
            name: GetQueryString("help_name") || "default"
          },
          dataType: 'json',
          type: 'POST'
      }).then((data) => {
        console.log(data);

      },(data) => {
        console.log(data)
      });



        /* 加载网页内容 */
        function loadHTML(data) {
        	var row = 0;
			var slideBar = document.getElementById("md-slideBar");
        	for (var mir = 0; mir < data.length; mir++) {
	            var path = data[mir].path;
	            if(path == "default.md" || path == "upFolder.md" || path == "error.md") continue;
	            var type = data[mir].type;
	            var li = null;
	            if(type == "file") {
					li = document.createElement('li');
					li.className = 'nav-item';
					let a = document.createElement('a');
					a.className = 'nav-link';
					let mdname = path.substring(0,path.length - 3);
					a.href = window.location.origin + '/help/'+mdname;
					a.innerText = mdname;
					li.appendChild(a);
					slideBar.insertBefore(li, slideBar.firstChlid);
            	}
	        }
            var staticNodes = '<hr class="slideBar-hr">\
            <li class="nav-item"><a class="nav-link" href="../mirror">进入下载页</a></li>\
            <li class="nav-item"><a class="nav-link" href="../">回到主页</a></li>';
            slideBar.innerHTML += staticNodes;
            $('#md-collapse').click(function(){$('.nav-link').not(":last").not(":last").toggle();});
        }
        /* 搜索按钮 */
        $('#btn-search').click(function() {UrlJump({"query": $("#input-query").val()});});
        /* 回车执行搜索 */
        $("#input-query").keydown(function(e) {switch (e.keyCode) {case 13:UrlJump({"query":$("#input-query").val()});break;default:break}});
        window.onload = function() {
            var ajax;
            /*1.创建XMLHttpRequest对象*/
            if(window.XMLHttpRequest) {
                /*  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码 */
                ajax = new XMLHttpRequest();
            } else {
                /* IE6, IE5 浏览器执行代码 */
                ajax = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var path = window.location.pathname;
            var mdname = "";
            if(path == '/help' || path == '/help/'){
                ajax.open("GET", "../_help/default.md");
            }
            else{
                mdname = path.match(/^\/help\/(.*)/);
                ajax.open("GET", "../_help/" + mdname[1] + ".md");
            }
            ajax.send();
            /*注册回调函数*/
            ajax.onreadystatechange = function() {
                if(ajax.readyState == 4 && ajax.status == 200) {
                    let Convertor = new showdown.Converter();
                    let res = ajax.responseText;
                    let html = Convertor.makeHtml(res);
                    document.getElementsByClassName("markdown-body")[0].innerHTML = html;
                }
            }
        }