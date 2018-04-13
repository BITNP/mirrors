String.prototype.in_array = function(arr) {
	for(item in arr) {
		if(this == arr[item])
			return true;
	}
	return false;
};

var output = null;

// output = 'cc.pn'.match(/(\.jpg)|(\.png)/);

output = '/'.in_array(['/', '/index', '/index/'])

console.log(output);