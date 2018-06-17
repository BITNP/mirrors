$(function() {
	$("#btn-name-search").click(function() {
		var val = $("#input-name-search").val();
		window.location.search = update_search({
			name: val
		});
	});
})