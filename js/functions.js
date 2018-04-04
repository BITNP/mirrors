// 数据过滤器, 通过 url 参数过滤
function dataFilter(data){
  var filteredData = {};
  var length = 0;
  switch(data.type){
    case "mirrors":
    {
      var oData = data.datas;
      filteredData.type = "mirrors";
      filteredData.datas = [];
      // conditions
      var query = requests['query'];
      var alphabet = requests['alphabet'];
      
      for(i in oData) 
      {
            var mirName = oData[i].name;
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
    }
    break;
    case "mirrorsDir":
    {
      var oData = data.datas;
      filteredData.type = "mirrorsDir";
      filteredData.datas = [];

      // conditions
      var query = requests['query'];
      var alphabet = requests['alphabet'];

      for(i in oData) {
        var mirName = oData[i].path;
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
    }
    break;
  }
  return filteredData;}


// url 参数获取器
function GetRequest() {var url = location.search;var theRequest = new Object();if (url.indexOf("?") != -1) {var str = url.substr(1);strs = str.split("&");for(var i = 0; i < strs.length; i ++) {theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);}}return theRequest;}


// url 跳转函数， 传入 url 参数
function UrlJump(request) {
  var href = window.location.pathname;
  if(request) {
    href += '?'
    for(i in request) {
      href += i + "=" + request[i];
      href += "&";
    }
    href = href.substring(0,href.length - 1);
  }
  window.location.href = href;}
