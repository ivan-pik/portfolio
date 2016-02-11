// -----------------------------------------------------------------
// Modernizr, History API Detection
// -----------------------------------------------------------------
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-history !*/
!function(n,e,o){function i(n,e){return typeof n===e}function t(){var n,e,o,t,a,f,d;for(var u in s)if(s.hasOwnProperty(u)){if(n=[],e=s[u],e.name&&(n.push(e.name.toLowerCase()),e.options&&e.options.aliases&&e.options.aliases.length))for(o=0;o<e.options.aliases.length;o++)n.push(e.options.aliases[o].toLowerCase());for(t=i(e.fn,"function")?e.fn():e.fn,a=0;a<n.length;a++)f=n[a],d=f.split("."),1===d.length?Modernizr[d[0]]=t:(!Modernizr[d[0]]||Modernizr[d[0]]instanceof Boolean||(Modernizr[d[0]]=new Boolean(Modernizr[d[0]])),Modernizr[d[0]][d[1]]=t),r.push((t?"":"no-")+d.join("-"))}}var s=[],a={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(n,e){var o=this;setTimeout(function(){e(o[n])},0)},addTest:function(n,e,o){s.push({name:n,fn:e,options:o})},addAsyncTest:function(n){s.push({name:null,fn:n})}},Modernizr=function(){};Modernizr.prototype=a,Modernizr=new Modernizr;var r=[];Modernizr.addTest("history",function(){var e=navigator.userAgent;return-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone")?n.history&&"pushState"in n.history:!1}),t(),delete a.addTest,delete a.addAsyncTest;for(var f=0;f<Modernizr._q.length;f++)Modernizr._q[f]();n.Modernizr=Modernizr}(window,document);


$(function() { // When DOM is ready

  // -----------------------------------------------------------------
  // Elements and Strings
  // -----------------------------------------------------------------

  var cssState           = $('body'),
      viewOtherClosed     = 'My work',
      viewOtherOpen       = 'Close',
      currentlyDisplayed  = 'Currently Displayed';



  // -----------------------------------------------------------------
  // JS Active Indication for CSS
  // -----------------------------------------------------------------

  cssState.removeClass('no-js').addClass('js');



  // -----------------------------------------------------------------
  // Touch Device Detection
  // -----------------------------------------------------------------

  $(document).on({
      'touchstart': function(e) {
          cssState.addClass('touch');
      }
  });





  // -----------------------------------------------------------------
  // Duplicate Projects List on Project Pages
  // -----------------------------------------------------------------

  function duplicateProjectsList() {
    var projectsListHTML = $('.js-projects').clone();
    $('.js-project-navigation--top').after(projectsListHTML);
  }
  duplicateProjectsList();

  function setActiveProjectItem() {
    $('.js-project-item-link')
      .each(function() {
        if (this.href == window.location.href) {
          $(this).replaceWith($('<span class="projects__item-link projects__item-link--displayed"><span class="projects__item-link-displayed-note">' + currentlyDisplayed + '</span>' + $(this).html() + '</span>'));
        }
      });
  }
  setActiveProjectItem();



  // -----------------------------------------------------------------
  // Projects List Toggle Buttons
  // -----------------------------------------------------------------

  // Projects Navigation Toggle State for History
  var topMenuOpen = false,
      bottomMenuOpen = false;

  function toggleNavigations(position) {
    var element = $(".js-other-projects[data-list='" + position + "']");
    var indicator;
    var textEl = '.js-project-navigation-toggle-text';
    if (position == 'top') {
      indicator = topMenuOpen;
    } else if (position == 'bottom') {
      indicator = bottomMenuOpen;
    }
    // Toggle Button Text and Class
    if (element.hasClass('project-navigation__link--close')) {
      element
        .removeClass('project-navigation__link--close')
        .children(textEl)
        .text(viewOtherClosed);
    } else {
      element
        .addClass('project-navigation__link--close')
        .children(textEl)
        .text(viewOtherOpen);
    }
    // Toggle Classes and States
    if (indicator == false) {
      cssState.addClass('other-projects-' + position + '--displayed');
      indicator = true;
    } else if (indicator == true) {
      cssState.removeClass('other-projects-' + position + '--displayed');
      indicator = false;
    }
    // Update Global Variables
    if (position == 'top') {
      topMenuOpen = indicator;
    } else if (position == 'bottom') {
      bottomMenuOpen = indicator;
    }
    // Update History State
    if (Modernizr.history) {
      updateHistoryState();
    }
  }

  $(document)
    .on('click', '.js-other-projects', function(e) {
      if (e.metaKey == false) {
        e.preventDefault();
        var position = $(this)
          .data('list');
        toggleNavigations(position);
      } else {
        return true;
      }
    });



  // -----------------------------------------------------------------
  // Scroll To Any Element; offset in PX, speed in ms
  // -----------------------------------------------------------------

  function scrollTo(ele, offset, speed) {
    $('html, body')
      .animate({
        scrollTop: ele + offset
      }, speed, 'swing');
    }





  // -----------------------------------------------------------------
  // Link to scroll to the top
  // -----------------------------------------------------------------
  var userScrolls = false;
  var lastScroll = 0;

  $('body').append('<span class="go-up js-go-up"></span>');

  $(document).on('click', '.js-go-up', function(e) {
    cssState.removeClass('show-go-up');
    scrollTo($('.site-header'), 0, 400);
  });

  function toggleGoUpLink(state) {
    var triggerScroll = ($('.site-header').outerHeight())+40;
    if ((triggerScroll <= $(this).scrollTop()) && state == "show"  ) {
      cssState.addClass('show-go-up');
    } else {
      cssState.removeClass('show-go-up');
    }
  }

  $(window).scroll(function(e) {
    userScrolls = true;
  });

  var scrollThrottle = setInterval(function() {
    if (userScrolls) {
      var scrollVal = $(this).scrollTop();

      if (lastScroll >= scrollVal) {
        toggleGoUpLink("show");
      } else {
        toggleGoUpLink("hide");
      }
      userScrolls = false;
      lastScroll = scrollVal;
    }

  }, 150);



  // -----------------------------------------------------------------
  // AJAX Page Navigation
  // -----------------------------------------------------------------

  if (Modernizr.history) {

    // -----------------------------------------------------------------
    // Manual Scroll Position Handling when Browsing History
    var manualScroll = false;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
      manualScroll = true;
      cssState.addClass('manual-scroll-restoration');
    }

    // -----------------------------------------------------------------
    // Initial Settings
    var navigationInProgress = false; // Flag that page transition is in progress
    var firstPushDone = false;

    // Elements which Triggers AJAX Navigation
    var ajaxTriggers = '.js-project-item-link, .js-home-link, .js-navigation-link, .js-next-project';

    // -----------------------------------------------------------------
    // AJAX loading message (delayed)

    $('body').append('<span class="ajax-loading-status">Loading</span>');


    var ajax_loadDone;

    $(document).on({
      ajaxStart: function() {
        ajax_loadDone = false;
        var loadTimeout = setTimeout(function() {
          if(!ajax_loadDone) {

              cssState.addClass('ajax-loading');
          }
        }, 1000);
      },
      ajaxStop: function() {
        ajax_loadDone = true;
        cssState.removeClass('ajax-loading');
      }
    });

    // -----------------------------------------------------------------
    // Initial History State; Saves current page type and scroll position
    function updateHistoryState() {
      var scrollTop = $(window).scrollTop();
      var scrollLeft = $(window).scrollLeft();
      var historyState = {
        transitionTo:   $('.js-content').data('page-type'),
        scrollTop:      scrollTop,
        scrollLeft:     scrollLeft,
        topMenuOpen:    topMenuOpen,
        bottomMenuOpen: bottomMenuOpen
      };
      history.replaceState(historyState, null, null);

      // Flag that history is app managed (avoid reacting to some browsers on load popstate event)
      firstPushDone = true;
    }
    updateHistoryState();

    // Saves current scroll position into current history state
    if (manualScroll) {
      $(window)
        .scroll(function() {
          clearTimeout($.data(this, 'scrollTimer'));
          $.data(this, 'scrollTimer', setTimeout(function() {
            updateHistoryState();
          }, 250));
        });
    }


    // -----------------------------------------------------------------
    // Prevents any other navigation to be executed while transitioning pages
    $(document)
      .on('click', 'a', function(event) {
        if (navigationInProgress) {
          event.preventDefault();
          return false;
        }
      });


    // -----------------------------------------------------------------
    // Set links to be handled via AJAX
    $(document)
      .on('click', ajaxTriggers, function(e) {
        var linkURL = $(this).attr('href');
        // Prevent navigating to the current page and disable AJAX on meta key
        if (e.metaKey == false) {
          e.preventDefault();
          var historyState = {
            transitionTo: $(this).data('transition-to')
          };
          if (navigationInProgress == false) {
            navigationInProgress = true;
            history.pushState(historyState, null, linkURL);
            changePage(linkURL, historyState, 'viaLink');
          }
        } else {
          return true;
        }
      });



      // -----------------------------------------------------------------
      // Loading and transitioning the content
      function changePage(href, state, trigger) {
        topMenuOpen = false;
        bottomMenuOpen = false;
        navigationInProgress = true;
        if (manualScroll == false && trigger == 'viaHistory') {
          cssState.addClass('hide-content');
        }
        var jqxhr = $.get(href, function(data) {
          document.title = data.match(/<title>(.*?)<\/title>/)[1];
          var currentStateType = $('.js-content').data('page-type');
          data = $(data).filter('.js-content');
          var f2, f3, f4, f5;

          // --------------------
          // KeyFrames Times (ms)

          // History Load: Browser scrolls
          if (manualScroll == false && trigger == 'viaHistory') {
            timeSwopContent   = 10;
            timeFadeIn        = 20;
            timeTransitionEnd = 220;
          }

          // History Load: App scrolls
          // when manual handling of scroll on history events is available
          if (manualScroll || trigger == 'viaHistory') {
            timeSwopContent   = 210;
            timeHistoryScroll = 220;
            timeFadeIn        = 620;
            timeTransitionEnd = 820;
          }

          // Link Load
          // to project page
          if (trigger == 'viaLink' && state.transitionTo == 'project') {
            timeScrollUp      = 220;
            timeSwopContent   = 640;
            timeFadeIn        = 660;
            timeTransitionEnd = 860;
          }

          // Link Load
          // to index|about pages
          if (trigger == 'viaLink' && state.transitionTo != 'project') {
            timeSwopContent   = 210;
            timeFadeIn        = 220;
            timeTransitionEnd = 420;
          }



          // Key 1: Fade-out the current page
          cssState.addClass('fade-out fade-out--' + currentStateType);
          // Indicate page transitions where the link in the header doesn't change
          if ((currentStateType == 'project' && (state.transitionTo == 'project' || state.transitionTo == 'index')) || (currentStateType == 'index' && state.transitionTo == 'project')) {
            cssState.addClass('navigation-no-transition');
          }
          // Indicate page transiton from 'index' to 'about' and vice versa
          if ((currentStateType == 'about' && state.transitionTo == 'index') || (currentStateType == 'index' && state.transitionTo == 'about')) {
            cssState.addClass('layout-no-transition');
          }

          // KeyFrame 2: Set scroll position
          if (trigger == 'viaLink' && state.transitionTo == 'project') {
            setTimeout(function() {
              scrollTo($('.js-content').offset().top, -40, 400);
            }, timeScrollUp);
          }

          // KeyFrame 3: Swop Content (invisible)
          setTimeout(function() {
            // Swop content
            $('.js-content').replaceWith(data);
            // Add CSS states
            cssState.removeClass('page-type--' + currentStateType);
            cssState.addClass('page-type--' + state.transitionTo);
            // Post-process content
            duplicateProjectsList();
            setActiveProjectItem();
            // Reset CSS states for project navigations
            cssState.removeClass('other-projects-top--displayed other-projects-bottom--displayed')

            // If browsing via history: Toggle project navigations depending on history state
            if (trigger == 'viaHistory') {
              if (state.topMenuOpen) {
                toggleNavigations('top');
              }
              if (state.bottomMenuOpen) {
                toggleNavigations('bottom');
              }
            }
          }, timeSwopContent);


          // Scroll to saved position
          if (trigger == 'viaHistory' && manualScroll) {
            setTimeout(function() {
              scrollTo(state.scrollTop, 0, 400);
              $(window).scrollLeft(state.scrollLeft);
            }, timeHistoryScroll);
          }

          // KeyFrame 4: Fade-in the new page
          setTimeout(function() {
            // Reveal the page
            cssState.removeClass('fade-out fade-out--' + currentStateType + ' hide-content');
            cssState.addClass('fade-in fade-in--' + state.transitionTo);

          }, timeFadeIn);

          // KeyFrame 5: Transition Finished
          setTimeout(function() {
            // Reset classes
            cssState.removeClass('fade-in fade-in--' + state.transitionTo + ' navigation-no-transition layout-no-transition');
            navigationInProgress = false;
          }, timeTransitionEnd);

          // Google Analytics
          ga('send', 'pageview', {
            'page': href,
            'title': document.title
          });
        })
        .fail(function() {
          navigationInProgress = false;
          // Try nonAJAX way (will display server error page if still fails)
          window.location.href = href;
        });
      }



  // -----------------------------------------------------------------
  // Browsing History Change
  $(window)
    .on('popstate', function(event) {
      var goToHistoryState = event.originalEvent.state;
      linkURL = location.pathname;
      if (goToHistoryState) {
        firstPushDone = true;
      } else {
        firstPushDone = false;
      }
      // Ignore browser's popstate on load
      if (firstPushDone && navigationInProgress == false) {
        changePage(linkURL, goToHistoryState, 'viaHistory');
      }
      // For fast sequence of changes, just load the page via HTTP
      else if (firstPushDone && navigationInProgress) {
        window.location.href = linkURL;
      }
    });
  } // END Ajax Loading
});