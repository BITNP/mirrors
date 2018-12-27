// Quantity Meter
jQuery("div.quantity").append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');
jQuery(".plus").click(function() {
	var currentVal = parseInt(jQuery(this).prev(".qty").val());
	if (!currentVal || currentVal=="" || currentVal == "NaN") currentVal = 0;
	jQuery(this).prev(".qty").val(currentVal + 1); 
});
	
jQuery(".minus").click(function() {
	var currentVal = parseInt(jQuery(this).next(".qty").val());
	if (currentVal == "NaN") currentVal = 0;
	if (currentVal > 0)
	        {
	            jQuery(this).next(".qty").val(currentVal - 1);
	        }
});
