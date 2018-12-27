(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['help'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<article>\r\n	<h4><a href=\"./help_single?help_name="
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a></h4>\r\n	<div class=\"blog-thumb\">\r\n		<img src=\"images/help/"
    + alias4(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data}) : helper)))
    + "\" class=\"img-responsive\" alt=\"\"/>\r\n	</div>\r\n	<div class=\"blog-excerpt\">\r\n		<p>"
    + alias4(((helper = (helper = helpers.brief_intro || (depth0 != null ? depth0.brief_intro : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brief_intro","hash":{},"data":data}) : helper)))
    + "</p>\r\n		<a href=\"./help_single?help_name="
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"bmore\">查看详情</a>\r\n	</div>\r\n	<div class=\"clearfix\"></div>\r\n	<div class=\"post-meta\">\r\n		<span><i class=\"fa fa-calendar\"></i>"
    + alias4(((helper = (helper = helpers.last_update || (depth0 != null ? depth0.last_update : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"last_update","hash":{},"data":data}) : helper)))
    + "</span>\r\n		<span><i class=\"fa fa-user\"></i> "
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + "</span>\r\n<!-- 		<span><i class=\"fa fa-folder\"></i> Category Name</span>\r\n		<span><i class=\"fa fa-tag\"></i> <a href=\"#\">girl</a>,<a href=\"#\">pink</a>,<a href=\"#\">cute</a>,<a href=\"#\">sweet</a></span>\r\n		<span><i class=\"fa fa-comments\"></i> 3 Comments</span>\r\n		<span><i class=\"fa fa-eye\"></i> 43</span> -->\r\n	</div>\r\n</article>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();