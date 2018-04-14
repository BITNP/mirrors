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

console.log(a);


if(a[a.length-1].match(/^\s$/) || a[a.length-1] == '') {
	a.pop();
}

a.pop();



console.log(a.join('/'));