/* ===================================================================
 * Hola - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";

    var cfg = {
        scrollDuration : 800, // smoothscroll duration
        mailChimpURL   : ''   // mailchimp url
    },

    $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function() {

        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');
        
        });
    };


    /* pretty print
     * -------------------------------------------------- */
    var ssPrettyPrint = function() {
        $('pre').addClass('prettyprint');
        $( document ).ready(function() {
            prettyPrint();
        });
    };


    /* Move header
     * -------------------------------------------------- */
    var ssMoveHeader = function () {

        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight();
            console.log("triggerHeight = ");
            console.log(triggerHeight);


        $WIN.on('scroll', function () {

            var loc = $WIN.scrollTop();
            console.log(loc);

            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }

        });

        // $WIN.on('resize', function() {
        //     if ($WIN.width() <= 768) {
        //             hdr.removeClass('sticky offset scrolling');
        //     }
        // });

    };


    /* Mobile Menu
     * ---------------------------------------------------- */ 
    var ssMobileMenu = function() {

        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');

        toggleButton.on('click', function(event){
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function() {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });

    };


    /* Masonry
     * ---------------------------------------------------- */ 
    var ssMasonryFolio = function () {

        var containerBricks = $('.masonry');

        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });
    };


    /* slick slider
     * ------------------------------------------------------ */
    var ssSlickSlider = function() {
        
        $('.testimonials__slider').slick({
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<div class=\'slick-prev\'><i class=\'im im-arrow-left\' aria-hidden=\'true\'></i></div>",
            nextArrow: "<div class=\'slick-next\'><i class=\'im im-arrow-right\' aria-hidden=\'true\'></i></div>",       
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    };


    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var ssWaypoints = function() {

        var sections = $(".target-section"),
            navigation_links = $(".header-nav li a");

        sections.waypoint( {

            handler: function(direction) {

                var active_section;

                active_section = $('section#' + this.element.id);

                if (direction === "up") active_section = active_section.prevAll(".target-section").first();

                var active_link = $('.header-nav li a[href="#' + active_section.attr("id") + '"]');

                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");

            },

            offset: '25%'

        });
        
    };


   /* Stat Counter
    * ------------------------------------------------------ */
    var ssStatCount = function() {

        var statSection = $(".s-stats"),
        stats = $(".stats__count");

        statSection.waypoint({

            handler: function(direction) {

                if (direction === "down") {

                    stats.each(function () {
                        var $this = $(this);

                        $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (curValue) {
                                $this.text(Math.ceil(curValue));
                            }
                        });
                    });

                } 

                // trigger once only
                this.destroy();

            },

            offset: "90%"

        });
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var ssSmoothScroll = function() {

        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
        
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing', function () {
                window.location.hash = target;
            });

        });
    };


    /* Placeholder Plugin Settings
     * ------------------------------------------------------ */
    var ssPlaceholder = function() {
        $('input, textarea, select').placeholder();  
    };


    /* Alert Boxes
     * ------------------------------------------------------ */
    var ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };


    /* Contact Form
     * ------------------------------------------------------ */
    var ssContactForm = function() {

        /* local validation */
	    $('#contactForm').validate({
        
            /* submit via ajax */
            submitHandler: function(form) {
    
                var sLoader = $('.submit-loader');
    
                $.ajax({
    
                    type: "POST",
                    url: "inc/sendEmail.php",
                    data: $(form).serialize(),
                    beforeSend: function() { 
    
                        sLoader.slideDown("slow");
    
                    },
                    success: function(msg) {
    
                        // Message was sent
                        if (msg == 'OK') {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').fadeOut();
                            $('#contactForm').fadeOut();
                            $('.message-success').fadeIn();
                        }
                        // There was an error
                        else {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').html(msg);
                            $('.message-warning').slideDown("slow");
                        }
    
                    },
                    error: function() {
    
                        sLoader.slideUp("slow"); 
                        $('.message-warning').html("Something went wrong. Please try again.");
                        $('.message-warning').slideDown("slow");
    
                    }
    
                });
            }
    
        });
    };


   /* Back to Top
    * ------------------------------------------------------ */
    var ssBackToTop = function() {

        var pxShow  = 500,   // height on which the button will show
        fadeInTime  = 400,   // how slow/fast you want the button to show
        fadeOutTime = 400,   // how slow/fast you want the button to hide
        scrollSpeed = 300,   // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
        goTopButton = $(".go-top")

        // Show or hide the sticky footer button
        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };

    var ssLoadPhotoswipe = function() {
        var photoswipe = document.querySelector("#photoswipe");
        if(photoswipe) {
            var piclist = photoswipe.dataset.list;
            var photoswipeContainer = document.createElement("div");
            photoswipeContainer.classList.add("band-gallery");
            photoswipe.appendChild(photoswipeContainer);
            $.getJSON(piclist, data => {
                console.log(data);
                for(let i=0 ; i<data.length; i++) {
                    let filen = data[i];
                    let photobox = document.createElement("div");
                    photobox.classList.add("band-img-box");
                    photoswipeContainer.appendChild(photobox);
                    let anchor = document.createElement("a");
                    anchor.href = filen;
                    photobox.appendChild(anchor);
                    let image = document.createElement("img");
                    image.src = filen;
                    image.onload = function() {
                        anchor.setAttribute("data-pswp-height", this.naturalHeight.toString());
                        anchor.setAttribute("data-pswp-width", this.naturalWidth.toString());
                    };
                    anchor.appendChild(image);
                }
            }).fail(function() {
                console.log("error");
            });
            const lightbox = new PhotoSwipeLightbox({
                gallery: '.band-gallery',
                children: 'div a',
                pswpModule: PhotoSwipe 
              });
              lightbox.init();
        }
    };

    var buildEventTable = function(jDivElement, jdata, filter) {
        var jconcerts = jdata["concerts"];
        var jselectedConcerts = [];
        jconcerts.forEach(function(obj) {
            if(filter) {
                if(filter(obj)) {
                    jselectedConcerts.push(obj);
                }
            }
            else {
                jselectedConcerts.push(obj);
            }
        });
        if(0 == jselectedConcerts.length) {
            return;
        }
        $(jDivElement).DataTable({
            data: jselectedConcerts,
            ordering: false,
            searching: false,
            paging: false,
            info: false,
            scrollX: true,
            columns: [
                {title: "Date", data: "date", render: function(data, type) {
                    let dateTokens = data.split("-");
                    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                      ];
                    let year = dateTokens[0];
                    let month = monthNames[parseInt(dateTokens[1])-1];
                    let day = dateTokens[2];
                    let datestr = `${day} ${month} ${year}`;
                    return datestr;
                }},
                {title: "Groupe", data: "groupe"},
                {title: "&Eacutev&egravenements", data: "evenement"},
                {title: "Lieu", data: "lieu"},
                {title: "Ville", data: "ville"}
            ]
        });
    };

    var createEventTableElement = function(element, filter) {
        let eventsFile = element.dataset.list;
        let title = element.dataset.title;
        let tableElement = document.createElement("table");                
        let titleElement = document.createElement("h4");
        titleElement.innerHTML = title;
        $(element).append(titleElement);
        $(element).append(tableElement);
        fetch(eventsFile)
        .then(function(response){
            return response.json();
        })
        .then(function(jdata){
            buildEventTable(tableElement, jdata, filter);                    
        });
    };

    var ssInitEventTables = function() {
        $(document).ready(function() {
            let today = new Date();
            $(".incoming-events-table").each(function() {
                createEventTableElement(this, function(obj) {
                    let d = new Date(obj["date"]);
                    return (d >= today);
                });
            });
            $(".past-events-table").each(function() {
                createEventTableElement(this, function(obj) {
                    let d = new Date(obj["date"]);
                    return (d < today);
                });
            });


        });
    };

   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssPrettyPrint();
        // ssMoveHeader();
        ssMobileMenu();
        ssMasonryFolio();
        ssSlickSlider();
        ssWaypoints();
        ssStatCount();
        // ssSmoothScroll();
        ssPlaceholder();

        ssAlertBoxes();
        ssContactForm();
        ssBackToTop();
        ssLoadPhotoswipe();
        ssInitEventTables();
    })();


})(jQuery);