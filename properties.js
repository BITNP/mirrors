const path = require('path');
const properties = {
	basepath:				"/web", // default: ""
	basepath_static:		"/web",
	image_upload_folder: 	path.join(__dirname, "/upload"),
	mirrors_json_path: 		path.join(__dirname, "/datas/mirrors.json"),
	mirrors_request_path:	path.join(__dirname, "/datas/mirrors_request.json"),
	mirrors_path: 			path.join(__dirname, "/mirror"),
	helps_json_path: 		path.join(__dirname, "/_help/helps.json"),
	helps_md_folder: 		path.join(__dirname, "/_help"),
	helps_image_folder: 	path.join(__dirname, "/public/images/help"),
	helps_path: 			path.join(__dirname, "/_help"),
	help_upload_access_code:"2018@Bitnp@help@upload",
	error_code: {
		help_exist: -1
	},
	privilige: {
		hide: 0,
		show: 1
	}
}

module.exports = properties;