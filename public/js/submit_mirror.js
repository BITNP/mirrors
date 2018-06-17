$('#btn_submit_mirror').click(function() {
  var name_id = $("#name_id").val();
  var qq = $("#qq").val();
  var wechat = $("#wechat").val();
  var tel = $("#tel").val();
  var mirror_name = $("#mirror_name").val();
  var mirror_link = $("#mirror_link").val();
  var message = $("#message").val();

  if(!name_id) {
      alert("请输入姓名或网上ID");
      return;
  }
  if(!(qq || wechat || tel)) {
      alert("请留下至少一种联系方式");
      return;
  }
  if(!mirror_name) {
      alert("请输入镜像名");
      return;
  }
  if(!mirror_link) {
      alert("请输入镜像链接");
      return;
  }
  if(!message) {
      alert("请输入推荐理由或留言");
      return;
  }

  $.ajax({
      url: '/submit_mirror',
      method: 'POST',
      data: {
        name_id: name_id,
        qq: qq,
        wechat: wechat,
        tel: tel,
        mirror_name: mirror_name,
        mirror_link: mirror_link,
        message: message
      },
      dataType: 'json',
      success: function(data) { 
      },
      error: function (jqXHR) {
          console.log(JSON.stringify(jqXHR));
      }
  })
  .done(function(_data) {
      let data = _data
      if(data.err) {
        alert(data.err);
      } else {
        alert('上传成功')
      }

  })
  .fail(function(data) {
      console.log(data);
  })
  .always(function(data) {
      // console.log('always');
  });
});


