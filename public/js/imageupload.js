// 图片上传插件
//声明一个保存base64的数组
var file_base64 = [];
//l声明一个临时变量
var temp;
//允许图片上传的大小 单位为M
var Maxsize = 5;
// $("#fileupload").change("click",function() {
//   getImage(this);
// });
// $("#fileupload2").change("click",function() {
//   getImage(this);
// });
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!= undefined) { // basic
     url = window.createObjectURL(file) ;
    } else if (window.URL!= undefined) { // mozilla(firefox)
     url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!= undefined) { // webkit or chrome
     url = window.webkitURL.createObjectURL(file) ;
    }
    return url;
}
function getImage(obj, _callback) {
    //上传图片
    var file = obj.files[0];
    // console.log(file)
    // 限制图片不大于5M
    if(file.size/1024/1024 > Maxsize ) {
        alert('最大支持5M的图片');
        return false;
    }
    //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件 
    if(!/image\/\w+/.test(file.type)){
        alert('请确保文件为图像类型');
        $(obj).val('');
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        temp = this.result; 
        file_base64.push(temp);
        // console.log(file_base64);
        _callback(file_base64);
    }
    // var objUrl = getObjectURL(obj.files[0]);
    // if (objUrl) {
    //     $("div.imgList").append('<img src="' + objUrl + '" alt="" />');
    //     $("div.newImgList").html('<img src="' + objUrl + '" alt="" />');
    //     $("div.imgList").html('<img src="' + objUrl + '" alt="" />');
    // }
}
// 图片上传插件
// 
// 
// <!--     <div class="imgList"></div>
//     <label  for="fileupload">点击选择文件</label>
//     <div class="copyinput"><input type="file" id="fileupload" name="wq" style="display: none;"></div> 

//     <div class="imgBase64"></div> -->