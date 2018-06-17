// Responsive Menu
(function($) {
    $.fn.menumaker = function(options) {

        var navmenu = $(this),
            settings = $.extend({
                title: "Menu",
                format: "dropdown",
                sticky: false
            }, options);

        return this.each(function() {
            navmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
            $(this).find("#menu-button").on('click', function() {
                $(this).toggleClass('menu-opened');
                var mainmenu = $(this).next('ul');
                if (mainmenu.hasClass('open')) {
                    mainmenu.hide().removeClass('open');
                } else {
                    mainmenu.show().addClass('open');
                    if (settings.format === "dropdown") {
                        mainmenu.find('ul').show();
                    }
                }
            });

            navmenu.find('li ul').parent().addClass('has-sub');

            multiTg = function() {
                navmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
                navmenu.find('.submenu-button').on('click', function() {
                    $(this).toggleClass('submenu-opened');
                    if ($(this).siblings('ul').hasClass('open')) {
                        $(this).siblings('ul').removeClass('open').hide();
                    } else {
                        $(this).siblings('ul').addClass('open').show();
                    }
                });
            };

            if (settings.format === 'multitoggle') multiTg();
            else navmenu.addClass('dropdown');

            if (settings.sticky === true) navmenu.css('position', 'fixed');

            resizeFix = function() {
                if ($(window).width() > 767) {
                    navmenu.find('ul').show();
                }

                if ($(window).width() <= 767) {
                    navmenu.find('ul').hide().removeClass('open');
                }
            };
            resizeFix();
            return $(window).on('resize', resizeFix);

        });
    };
})(jQuery);

$(document).ready(function() {
    "use strict";
    $("#navmenu").menumaker({
        title: "Menu",
        format: "multitoggle"
    });

    $("#navmenu").prepend("<div id='menu-line'></div>");

    var foundActive = false,
        activeElement, linePosition = 0,
        menuLine = $("#navmenu #menu-line"),
        lineWidth, defaultPosition, defaultWidth;

    $("#navmenu > ul > li").each(function() {
        if ($(this).hasClass('active')) {
            activeElement = $(this);
            foundActive = true;
        }
    });

    activeElement = $("#navmenu > ul > li").first();
    defaultWidth = lineWidth = activeElement.width();

    defaultPosition = linePosition = activeElement.position().left;

    menuLine.css("width", lineWidth);
    menuLine.css("left", linePosition);

    $("#navmenu > ul > li").hover(function() {
            activeElement = $(this);
            lineWidth = activeElement.width();
            linePosition = activeElement.position().left;
            menuLine.css("width", lineWidth);
            menuLine.css("left", linePosition);
        },
        function() {
            menuLine.css({ width: lineWidth, left: linePosition });
        });

    /* About Slider */
    $('.about-slider').slick({
        arrows: true,
        speed: 600,
        centerMode: false,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Shop Slider */
    $('.shop-slider1').slick({
        arrows: true,
        speed: 600,
        centerMode: false,
        autoplay: false,
        autoplaySpeed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Shop Slider */
    $('.shop-slider2').slick({
        arrows: true,
        speed: 600,
        centerMode: false,
        autoplay: false,
        autoplaySpeed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Shop Slider */
    $('.shop-slider3').slick({
        arrows: true,
        speed: 600,
        centerMode: false,
        autoplay: false,
        autoplaySpeed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Shots Slider */
    $('.shots-slider').slick({
        arrows: true,
        speed: 900,
        autoplay: true,
        autoplaySpeed: 2500,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Blog Slider */
    $("#blog-slider").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true
    });

    /* Quote Slider */
    $('.quote-slider').slick({
        arrows: true,
        speed: 300,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Single Blog Slider */
    $('.sblog-slider').slick({
        arrows: true,
        speed: 300,
        centerMode: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* News Slider */
    $('.lnews-slider').slick({
        arrows: true,
        speed: 300,
        centerMode: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    /* Magazine Slider */
    $('.magazine-slider').slick({
        arrows: true,
        speed: 700,
        autoplay: true,
        autoplaySpeed: 4000,
        centerMode: false,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1
    });

    /* Custom Tabs Slider */
    $(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });


    // Skills3 Animated 
    $('.skills-v3').appear(function() {
        $('.ps1 .progress-bar').css("width", "70%");
        $('.ps2 .progress-bar').css("width", "60%");
        $('.ps3 .progress-bar').css("width", "90%");
        $('.ps4 .progress-bar').css("width", "40%");
        $('.ps5 .progress-bar').css("width", "85%");
        $('.ps6 .progress-bar').css("width", "54%");
        $('.ps7 .progress-bar').css("width", "71%");
        $('.ps8 .progress-bar').css("width", "92%");

    }, {
        accX: 0,
        accY: -300
    });

    // Skills4 Animated 
    $('.skills-v4').appear(function() {
        $('.ps9 .progress-bar').css("width", "70%");
        $('.ps10 .progress-bar').css("width", "60%");
        $('.ps11 .progress-bar').css("width", "90%");
        $('.ps12 .progress-bar').css("width", "40%");
        $('.ps13 .progress-bar').css("width", "85%");
        $('.ps14 .progress-bar').css("width", "54%");
        $('.ps15 .progress-bar').css("width", "71%");
        $('.ps16 .progress-bar').css("width", "92%");

    }, {
        accX: 0,
        accY: -300
    });

    // Countdown Timer
    var endDate = "February 14, 2015 15:03:25";
    $('.countdown.styled').countdown({
        date: endDate,
        render: function(data) {
            $(this.el).html("<div><em>" + this.leadingZeros(data.days, 2) + " </em><span>days</span></div><div><em>" + this.leadingZeros(data.hours, 2) + " </em><span>hrs</span></div><div><em>" + this.leadingZeros(data.min, 2) + " </em><span>min</span></div><div><em>" + this.leadingZeros(data.sec, 2) + " </em><span>sec</span></div>");
        }
    });

    // Slider Range
    $("#sliderRange")
        .slider({
            range: true,
            min: 0,
            max: 1000,
            step: 1,
            values: [0, 1000],
            slide: function(event, ui) {
                var price1 = ui.values[0];
                var price2 = ui.values[1];
                $("#price1")
                    .val("\u20ac" + price1);
                $("#price2")
                    .val("\u20ac" + price2);
            }
        });

    $('#price1')
        .bind('keyup', function() {
            var from = $(this)
                .val();
            var to = $('#price2')
                .val();
            $('#sliderRange')
                .slider('option', 'values', [from, to]);
        });

    $('#price2')
        .bind('keyup', function() {
            var from = $('#price1')
                .val();
            var to = $(this)
                .val();
            $('#sliderRange')
                .slider('option', 'values', [from, to]);

        });

    // Custom Select
    enableSelectBoxes();
});

function enableSelectBoxes() {
    $('div.selectBox').each(function() {
        $(this).children('span.selected').html($(this).children('div.selectOptions').children('span.selectOption:first').html());
        $(this).attr('value', $(this).children('div.selectOptions').children('span.selectOption:first').attr('value'));

        $(this).children('span.selected,span.selectArrow').on('click', function() {
            if ($(this).parent().children('div.selectOptions').css('display') == 'none') {
                $(this).parent().children('div.selectOptions').css('display', 'block');
            } else {
                $(this).parent().children('div.selectOptions').css('display', 'none');
            }
        });

        $(this).find('span.selectOption').on('click', function() {
            $(this).parent().css('display', 'none');
            $(this).closest('div.selectBox').attr('value', $(this).attr('value'));
            $(this).parent().siblings('span.selected').html($(this).html());
        });
    });
}

// Isotope
$(window).load(function() {
    "use strict";
    var $container = $('#folio');
    $container.isotope({
        itemSelector: '.folio-item',
        transitionDuration: '0.8s'
    });
    var $optionSets = $('#portfolio-wrap .folio-filter'),
        $optionLinks = $optionSets.find('a');
    $optionLinks.click(function() {
        var $this = $(this);
        if ($this.hasClass('selected')) {
            return false;
        }
        var $optionSet = $this.parents('.folio-filter');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        value = value === 'false' ? false : value;
        options[key] = value;
        if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
            changeLayoutMode($this, options);
        } else {
            $container.isotope(options);
        }
        return false;
    });
});

// Prettyphoto
$("a[class^='prettyPhoto']").prettyPhoto({
    theme: 'pp_default'
});

// js Extras
$(".closeit").on('click', function() {
    $(this).parent().parent().hide(500);
});
$(".selected").on('click', function() {
    $(this).toggleClass("active");
});
$(".shop-cart").on('click', function() {
    $("#cart-main").slideToggle(function() {});
});
$(".shop-cart1").on('click', function() {
    $("#cart-main").slideToggle(function() {});
});
$(".shop-cart2").on('click', function() {
    $("#cart-main").slideToggle(function() {});
});

var count = 0;
$(".shop-btn").on('click', function() {
    count++;
    $(".shop-cart span").html((+count));
});

var counts = 0;
$(".shop-btn1").on('click', function() {
    counts++;
    $(".h31-cart span").html((+counts));
});

var countss = 0;
$(".shop-btn2").on('click', function() {
    countss++;
    $(".t2-pcount").html((+countss));
});

$('.shop-btn').on('click', function() {
    var cart = $('.cart-main');
    var imgtodrag = $(this).parent().parent('.product-info').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '10000'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        setTimeout(function() {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function() {
            $(this).detach()
        });
    }
});

$('.shop-btn').on('click', function() {
    var cart = $('.cart-main');
    var imgtodrag = $(this).parent().parent('.product-info').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '10000'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        setTimeout(function() {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function() {
            $(this).detach()
        });
    }
});

$('.shop-btn').on('click', function() {
	$("html, body").animate({
		scrollTop: 0
	}, 600);
    return false;
});


$("#search_mirror").click(function() {
    let val = $("#input_search_mirror").val();
    window.location.href = '/mirror?name=' + val;
})

$("#search_help").click(function() {
    let val = $("#input_search_help").val();
    window.location.href = '/helps?name=' + val;
})