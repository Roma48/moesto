
/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.noConflict();
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

//
var page_loaded = false;
// animations
var elementsToAnimate = [];
//
var headerHeight = ''

jQuery(document).ready(function() {	
	//
	page_loaded = true;
	
	headerHeight = jQuery('#gkHeader').outerHeight();
	// smooth anchor scrolling
	//new SmoothScroll(); 
	// style area
	if(jQuery('#gkStyleArea')){
		jQuery('#gkStyleArea').find('a').each(function(i,element){
			jQuery(element).click(function(e){
	            e.preventDefault();
	            e.stopPropagation();
				changeStyle(i+1);
			});
		});
	}
	// font-size switcher
	if(jQuery('#gkTools') && jQuery('#gkMainbody')) {
		var current_fs = 100;
		
		jQuery('#gkMainbody').css('font-size', current_fs+"%");
		
		jQuery('#gkToolsInc').click(function(e){ 
			e.stopPropagation();
			e.preventDefault(); 
			if(current_fs < 150) {  
				jQuery('#gkMainbody').animate({ 'font-size': (current_fs + 10) + "%"}, 200); 
				current_fs += 10; 
			} 
		});
		jQuery('#gkToolsReset').click(function(e){ 
			e.stopPropagation();
			e.preventDefault(); 
			jQuery('#gkMainbody').animate({ 'font-size' : "100%"}, 200); 
			current_fs = 100; 
		});
		jQuery('#gkToolsDec').click(function(e){ 
			e.stopPropagation();
			e.preventDefault(); 
			if(current_fs > 70) { 
				jQuery('#gkMainbody').animate({ 'font-size': (current_fs - 10) + "%"}, 200); 
				current_fs -= 10; 
			} 
		});
	}
	// K2 font-size switcher fix
	if(jQuery('#fontIncrease') && jQuery('.itemIntroText')) {
		jQuery('#fontIncrease').click(function() {
			jQuery('.itemIntroText').attr('class', 'itemIntroText largerFontSize');
		});
		
		jQuery('#fontDecrease').click( function() {
			jQuery('.itemIntroText').attr('class', 'itemIntroText smallerFontSize');
		});
	}
	
	if(jQuery('#system-message-container a.close')){
		  jQuery('#system-message-container').find('a.close').each(function(i, element){
		  		jQuery('#system-message-container').css({'display' : 'block'});	
	           jQuery(element).click(function(e){
	           		e.preventDefault();
	           		e.stopPropagation();
	                jQuery(element).parents().eq(2).fadeOut();
	                (function() {
	                     jQuery(element).parents().eq(2).css({'display': 'none'});
	                }).delay(500);
	           });
	      });
	 } 
	
	// create the list of elements to animate
	jQuery('.gkHorizontalSlideRightColumn').each(function(i,element) {
		elementsToAnimate.push(['animation', element, jQuery(element).offset().top]);
	});
	
	jQuery('.layered').each(function(i,element) {
		elementsToAnimate.push(['animation', element, jQuery(element).offset().top]);
	});
	
	jQuery('.gkPriceTableAnimated').each(function(i,element) {
		elementsToAnimate.push(['queue_anim', element, jQuery(element).offset().top]);
	});
});

//
jQuery(window).scroll(function() {
	// menu animation
	
	
	if(page_loaded && jQuery('body').hasClass('imageBg')) {
		// if menu is not displayed now
		if(jQuery(window).scrollTop() > headerHeight && !jQuery('#gkMenuWrap').hasClass('active')) {
			//document.id('gkHeaderNav').inject(document.id('gkMenuWrap'), 'inside');
			jQuery('#gkMenuWrap').append(jQuery('#gkHeaderNav'));
			jQuery('#gkHeader').attr('class', 'gkNoMenu');
			// hide
			jQuery('#gkMenuWrap').attr('class', 'active');
		}
		//
		if(jQuery(window).scrollTop() <= headerHeight && jQuery('#gkMenuWrap').hasClass('active')) {
			jQuery('#gkHeader').first('div').css('display', 'block');
			jQuery('#gkHeader').first('div').prepend(jQuery('#gkHeaderNav'));
			jQuery('#gkHeader').attr('class', '');
			jQuery('#gkMenuWrap').attr('class', '');
		}
	}
	// animate all right sliders
	if(elementsToAnimate.length > 0) {		
		// get the necessary values and positions
		var currentPosition = jQuery(window).scrollTop();
		var windowHeight = jQuery(window).outerHeight();
		
		// iterate throught the elements to animate
		if(elementsToAnimate.length) {
			for(var i = 0; i < elementsToAnimate.length; i++) {
				if(elementsToAnimate[i][2] < currentPosition + (windowHeight / 2)) {
					// create a handle to the element
					var element = elementsToAnimate[i][1];
					// check the animation type
					if(elementsToAnimate[i][0] == 'animation') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						gkAddClass(element, 'loaded', false);
						// clean the array element
						elementsToAnimate[i] = null;
					}
					// if there is a queue animation
					else if(elementsToAnimate[i][0] == 'queue_anim') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						jQuery(element).find('dl').each(function(j, item) {
							gkAddClass(item, 'loaded', j);
						});
						// clean the array element
						elementsToAnimate[i] = null;
					}
				}
			}
			// clean the array
			elementsToAnimate = elementsToAnimate.clean();
		}
	}
});
//
function gkAddClass(element, cssclass, i) {
	var delay = jQuery(element).attr('data-delay');
	
	if(!delay) {
		delay = (i !== false) ? i * 150 : 0;
	}

	setTimeout(function() {
		jQuery(element).addClass(cssclass);
	}, delay);
}
//

jQuery(window).ready(function() {
	//
	var menuwrap = new jQuery('<div />', {
		'id': 'gkMenuWrap'
	});
	
	//
	jQuery('body').append(menuwrap);
	//
	if(!jQuery('body').hasClass('imageBg')) {
		jQuery('#gkMenuWrap').append(jQuery('#gkHeaderNav'));
		jQuery('#gkHeader').attr('class', 'gkNoMenu');
		jQuery('#gkHeader > div').first().css('display', 'none');
		jQuery('#gkMenuWrap').attr('class', 'active');
	}
	//
	// some touch devices hacks
	//
	
	// hack modal boxes ;)
	jQuery('a.modal').each(function(i,link) {
		// register start event
		var lasttouch = [];
		// here
		jQuery(link).bind('touchstart', function(e) {
			lasttouch = [link, new Date().getTime()];
		});
		// and then
		jQuery(link).bind('touchend', function(e) {
			// compare if the touch was short ;)
			if(lasttouch[0] == link && Math.abs(lasttouch[1] - new Date().getTime()) < 500) {
				window.location = jQuery(link).attr('href');
			}
		});
	});
});

// Function to change styles
function changeStyle(style){
	var file1 = $GK_TMPL_URL+'/css/style'+style+'.css';
	var file2 = $GK_TMPL_URL+'/css/typography/typography.style'+style+'.css';
	var file3 = $GK_TMPL_URL+'/css/typography/typography.iconset.style'+style+'.css';
	jQuery('head').append('<link rel="stylesheet" href="'+file1+'" type="text/css" />');
	jQuery('head').append('<link rel="stylesheet" href="'+file2+'" type="text/css" />');
	jQuery('head').append('<link rel="stylesheet" href="'+file3+'" type="text/css" />');
	jQuery.cookie('gk_simplicity_j30_style', style, { expires: 365, path: '/' });
}

jQuery(window).load(function() {
	if(elementsToAnimate.length > 0) {		
		// get the necessary values and positions
		var currentPosition = jQuery(window).scrollTop();
		var windowHeight = jQuery(window).outerHeight();
		
		// iterate throught the elements to animate
		if(elementsToAnimate.length) {
			for(var i = 0; i < elementsToAnimate.length; i++) {
				if(elementsToAnimate[i][2] < currentPosition + (windowHeight / 2)) {
					// create a handle to the element
					var element = elementsToAnimate[i][1];
					// check the animation type
					if(elementsToAnimate[i][0] == 'animation') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						gkAddClass(element, 'loaded', false);
						// clean the array element
						elementsToAnimate[i] = null;
					}
					// if there is a queue animation
					else if(elementsToAnimate[i][0] == 'queue_anim') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						jQuery(element).find('dl').each(function(j, item) {
							gkAddClass(item, 'loaded', j);
						});
						// clean the array element
						elementsToAnimate[i] = null;
					}
				}
			}
			// clean the array
			elementsToAnimate = elementsToAnimate.clean();
		}
	}
});
