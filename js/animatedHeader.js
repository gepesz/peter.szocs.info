/**
 * animatedHeader.js
 * 
 * Simple jQuery component that will animate a fixed header on scroll.
 * CSS classes used:
 * .navbar-default: default (large) header
 * .navbar-shrink:  shrunk (small) header
 *
 * v1.0.0
 * 
 * Code released under the Apache 2.0 license.
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Copyright 2015, Peter Szocs.
 * http://peter.szocs.info
 */

var animatedHeader = {
	didScroll: false,
	changeHeaderOn: 300,
	
	scrollPage: function() {
		if ( $(window).scrollTop() >= this.changeHeaderOn ) {
			$('.navbar-default').addClass('navbar-shrink');
		} else {
			$('.navbar-default').removeClass('navbar-shrink');
		}
		this.didScroll = false;
	}
};

$(window).on('scroll', function(e) {
    if( !animatedHeader.didScroll ) {
		animatedHeader.didScroll = true;
		setTimeout( animatedHeader.scrollPage(), 200 );
	}
});