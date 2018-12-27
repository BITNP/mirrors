$(document).ready(function($) {
	$('#product-single').flexslider({
		animation: "fade",
		slideshow: false,                
		directionNav: false,
		controlsContainer: ".product-single",
		controlNav: true,
		manualControls: ".product-single-nav li"
	});

});


$(document).ready(function($) {
	$('#hlblog').flexslider({
		animation: "fade",
		slideshow: true,                
		directionNav: false,
		controlsContainer: ".home-lblog",
		controlNav: true,
		manualControls: ".hlb-nav li"
	});

});
