import showdown from 'showdown';

var http = require('http');
var fs = require('fs');
var PORT = 3000;

// var app = http.createServer(onRequest);
// app.listen(PORT);



function start(route, handle) {


  function onRequest (req, res) {
  	let filename = 'test.md';
    res.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
    let fileContent = fs.readFileSync(filename);
    let content = renderMD(fileContent);
    res.write(content);
    res.end();
  }
}


let fileContent = fs.readFileSync(filename);
let content = renderMD(fileContent);
console.log(content);

function renderMD(fileContent){
    let Convertor = new showdown.Converter();
    let html = Convertor.makeHtml(fileContent);
    return html;
	// let path = Params[0].file;
	// if(param !== null && param !== undefined && param !== ' '){
	//     path = Params[param].file;
	// }
	// let tmp =  Ajax({
	//     url:path,
	//     headers:{
	//         'content-type':'text/plain'
	//     },
	//     method:'get'
	// });
	// tmp.then(res => {
	//     // console.log(res);
	//     let Convertor = new showdown.Converter();
	//     let html = Convertor.makeHtml(res);
	//     document.getElementsByClassName('DetailDisplay')[0].innerHTML = html;
	// });
}