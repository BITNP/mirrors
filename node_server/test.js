String.prototype.in_array = function(arr) {
	for(item in arr) {
		if(this == arr[item])
			return true;
	}
	return false;
};

var output = null;

var href = '/mirror/deepin/';

var a = href.split('/');

output = '/'.in_array(['/', '/index', '/index/'])



if(a[a.length-1].match(/^\s$/) || a[a.length-1] == '') {
	a.pop();
}

a.pop();


function test(){
	for(item in arguments) {
		console.log(arguments[item]);
	}
}

// test(1,3,5,2,"fdgsdf")

// console.log(typeof /^\/help/)
// console.log(typeof [])



var protocol = 'http:';

var origin = (protocol.indexOf(":") != -1)?"//":"://"