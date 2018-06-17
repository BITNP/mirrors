$("#file").on('change', function(){
    getImage($("#file")[0], function(base64) {
      $("#imagehide").attr("src", base64[base64.length-1]);
    });
});

$('#btn_submit_help').click(function() {
  var base64 = $("#imagehide").attr('src');
  var name_id = $("#name_id").val();
  var code = $("#code").val();
  var help_name = $("#help_name").val();
  var help_brief = $("#help_brief").val();
  var help_content = $("#help_content").val();

  if(!base64) {
    alert("请选择一张图片");
    return;
  }
  if(!name_id) {
      alert("请输入姓名或网上ID");
      return;
  }
  if(!code) {
      alert("请输入上传准入码");
      return;
  }
  if(!help_name) {
      alert("请输入文档名");
      return;
  }
  if(!help_brief) {
      alert("请输入文档简介");
      return;
  }
  if(!help_content) {
      alert("请输入文档内容");
      return;
  }

  var formData = new FormData();
  // formData.ppend(name, element);
  formData.append('myfile', $('#file')[0].files[0]);
  formData.append('name_id', name_id);
  formData.append('code', code);
  formData.append('help_name', help_name);
  formData.append('help_brief', help_brief);
  formData.append('help_content', help_content);
  $.ajax({
      url: '/submit_help',
      method: 'POST',
      data: formData,
      contentType: false, // 注意这里应设为false
      processData: false,
      cache: false,
      success: function(data) { 
      },
      error: function (jqXHR) {
          console.log(JSON.stringify(jqXHR));
      }
  })
  .done(function(_data) {
      let data = JSON.parse(_data)
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


