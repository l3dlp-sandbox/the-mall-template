/*
 * Mewsoft Bootstrap iPod Style jQuery Drill Down Menu Plugin v1.0
 * Dr. Ahmed Amin Elsheshtawy ahmed@mewsoft.com, Ph.D.
 * Copyright (c) 2015 Mewsoft, www.mewsoft.com
 * https://github.com/mewsoft
 * http://www.mewsoft.com/
 *
 * Original jquery ui plugin code by:
 * DC jQuery Drill Down Menu - jQuery drill down ipod menu
 * Copyright (c) 2011 Design Chemical
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {
    $.fn.drilldown = function (options) {
        var defaults = {
            wrapper_class:     'drilldown',
            wrapper_id:        '',
            menu_class:        'drilldown-menu',
            submenu_class:     'nav',
            parent_class:      'drilldown-parent',
            parent_class_link: 'drilldown-parent-a',
            active_class:      'active',
            header_class_list: 'breadcrumb',
            header_class:      'breadcrumbwrapper',
            footer_tag:       'hr',
            footer_class:     'drilldown-footer',
            footer_content:   '',
            class_selected:    'drilldown-selected',
            speed:             'fast',
            save_state:        true,
            show_count:        false,
            count_class:       'drilldown-count',
            icon_class:        'glyphicon glyphicon-chevron-right pull-right',
            link_type:         'backlink', // breadcrumb , link, backlink
            reset_text:        '<span class="glyphicon glyphicon-folder-open"></span> All', // All
            default_text:      'Select Option',
            show_end_nodes:    true, // drill to final empty nodes
            show_header:       false,
            header_tag:        'div',
            header_tag_class:  'list-group-item active', // hidden list-group-item active
            header_wrap:       'drilldown-header-wrap',
            init_padding:      0,
            scroll_padding:    5,
            menu_padding:      15,
            responsive_hide:   true,
            responsive:        {
                lg: {
                    breakpoint: 1024,
                    init:       'show',
                    change:     'keep'
                },
                md: {
                    breakpoint: 768,
                    init:       'show',
                    change:     'keep'
                },
                sm: {
                    breakpoint: 480,
                    init:       'show',
                    change:     'keep'
                },
                xs: {
                    breakpoint: 0,
                    init:       'show',
                    change:     'keep'
                }
            }
        };

        //call in the default options
        options = $.extend(true, {}, defaults, options);

        //act upon the element that is passed into the design
        return this.each(function() {

            var $drilldown = this;

            $($drilldown)
                .addClass(options.menu_class)
                .addClass(options.submenu_class)
                .removeClass('hidden')
                .wrap(
                '<div id="' + options.wrapper_id + '" class="' + options.wrapper_class + '"/>'
            );

            var $wrapper = $('#'+options.wrapper_id),
                objIndex = $($wrapper).index('.' + options.wrapper_class),
                idHeader = options.header_class + '-' + objIndex;

            $($wrapper).attr('id', options.wrapper_id);

            var $header = '<div id="drilldown-header-wrap">'
                    + (options.header_insert ? options.header_insert : '')
                    + '<div id="' + idHeader + '" class="' + options.header_class + '">'
                    + '</div>'
                    + '</div>'
                ;

            var $footer = '';

            if ( options.footer_insert ) {
                $footer = options.footer_insert;
            }

            setUpDrilldown();

            // if no selection, check previous cookie saved selection
            if (!checkSelected($drilldown, $wrapper)) {
                if (options.save_state == true) {
                    checkCookie($wrapper.attr('id'), $drilldown);
                }
            }

            resetDrilldown($drilldown, $wrapper);

            function responsiveToggle() {
                $.each(options.responsive, function(i, v) {
                    if ( $(window).width() >= (v.breakpoint+1) ) {
                        if ( v.change == 'hide' ) {
                            if ($wrapper.data('collapsed') == 'collapsed') {
                                $wrapper.slideDown(0);

                                resizeDrilldown($drilldown, $wrapper);

                                $wrapper.slideUp(0);
                            } else {
                                resizeDrilldown($drilldown, $wrapper);
                            }
                        } else if ( v.change == 'show' ) {
                            if ($wrapper.data('collapsed') == 'collapsed') {
                                $wrapper.slideDown(0);

                                resizeDrilldown($drilldown, $wrapper);

                                $wrapper.removeData('collapsed');
                            } else {
                                resizeDrilldown($drilldown, $wrapper);
                            }
                        } else if ( v.change == 'keep' ) {
                            if ($wrapper.data('collapsed') == 'collapsed') {
                                $wrapper.slideDown(0);

                                resizeDrilldown($drilldown, $wrapper);

                                $wrapper.slideUp(0);
                            } else {
                                resizeDrilldown($drilldown, $wrapper);
                            }
                        }

                        return false;
                    } else {
                        return true;
                    }
                });
            }

            if ( options.responsive_hide == false ) {
                $(window).resize(function() {
                    resizeDrilldown($drilldown, $wrapper);
                });
            } else {
                $(window).resize(responsiveToggle);
            }

            responsiveToggle();

            $('li a', $drilldown).click(function(e) {
                var $return = false;

                $el = $(this);

                $activeLi = $el.parent('li').stop();

                $siblingsLi = $($activeLi).siblings();

                // Prevent browsing to link if has child links
                if (
                    $(e.target).hasClass(options.parent_class_link)
                    && ($(e.target).attr('href') !== '#')
                ) {
                    $el.addClass(options.active_class);

                    $return = true;
                } else if (
                    $('> ul',$activeLi).length
                    || options.show_end_nodes
                ) {
                    if ($el.hasClass(options.active_class)) {
                        $('ul a',$activeLi).removeClass(options.active_class);

                        resetDrilldown($drilldown, $wrapper);
                    } else {
                        actionDrillDown($activeLi, $wrapper, $drilldown);
                    }

                    // scroll to top on click
                    $($wrapper,$drilldown).scrollTop(0);

                    e.preventDefault();
                    e.stopPropagation();

                    $el.trigger('drilldown.parentclick');
                } else if ($(e.target).attr('href') !== '#') {
                    $el.addClass(options.active_class);

                    $return = true;
                }

                $el.trigger('drilldown.linklclick');

                return $return;
            });

            // Breadcrumbs
            $('#' + idHeader).on('click', 'a', function(e) {

                if ($(this).hasClass('link-back')) {
                    linkIndex = $('#'+options.wrapper_id+' .'+options.parent_class_link+'.active').length;

                    linkIndex = linkIndex-2;

                    $('a.'+options.active_class+':last', $drilldown).removeClass(options.active_class);
                } else {
                    // Get link index
                    var linkIndex = parseInt($(this).index('#'+idHeader+' a'));

                    if (linkIndex == 0) {
                        $('a',$drilldown).removeClass(options.active_class);
                    } else {
                        // Select equivalent active link
                        linkIndex = linkIndex-1;

                        $('a.'+options.active_class+':gt('+linkIndex+')',$drilldown).removeClass(options.active_class);
                    }
                }

                resetDrilldown($drilldown, $wrapper);

                e.preventDefault();

                $($drilldown).trigger('drilldown.linklclick');
            });

            function setUpDrilldown() {
                var $wrapper = $('#'+options.wrapper_id)

                $('ul', $drilldown).each(function() {
                    $(this).addClass(options.submenu_class);
                });

                $($drilldown).before($header);

                $($drilldown).after($footer);

                var drilldownWidth = $($drilldown).outerWidth(true);

                var drilldownHeight = 0;

                $('> ul', $wrapper).children('li').each(function() {
                    drilldownHeight += $(this).outerHeight();
                });

                var drilldownHeightAll =
                        $('#'+options.header_wrap).outerHeight(true)
                        + drilldownHeight
                        + $($footer).outerHeight(true)
                        + options.menu_padding
                        + options.init_padding
                    ;

                $($wrapper).css({
                    height: drilldownHeightAll + 'px',
                    width: drilldownWidth + 'px'
                });

                $($drilldown).css({
                    height: drilldownHeight + 'px',
                    width: drilldownWidth + 'px'
                });

                // Set sub menu width and offset
                $('li', $drilldown).each(function() {
                    $(this).css({
                        width: drilldownWidth + 'px'
                    });

                    $('ul',this).css({
                        width: drilldownWidth + 'px',
                        marginRight: '-' + drilldownWidth + 'px',
                        marginTop: '0'
                    });

                    if ($('> ul',this).length) {
                        $(this).addClass(options.parent_class);

                        $('> a',this).addClass(options.parent_class_link).append(
                            '<span class="' + options.icon_class + '"></span>'
                        );

                        if (options.show_count == true) {
                            var parentLink = $('a:not(.'+options.parent_class_link+')', this);

                            $('> a',this).append(
                                ' <span class="' + options.count_class + '">'
                                + '(' + parseInt( $(parentLink).length ) + ')'
                                + '</span>'
                            );
                        }
                    }
                });

                if (options.link_type == 'link') {
                    $('ul', $drilldown).css(
                        'top', $('li', $drilldown).outerHeight(true) + 'px'
                    );
                }

                $.each(options.responsive, function(i, v) {
                    if ( $(window).width() >= (v.breakpoint+1) ) {
                        if ( v.init == 'hide' ) {
                            $wrapper.hide(0);

                            $wrapper.data('collapsed', 'collapsed');
                        } else if ( v.init == 'show' ) {
                            $wrapper.show(0);
                        }

                        return false;
                    } else {
                        return true;
                    }
                });
            }
        });

        function actionDrillDown(element, wrapper, $drilldown) {
            var $header = $('.' + options.header_class, wrapper);

            // Get new breadcrumb and header text
            var getNewBreadcrumb = $(options.header_tag, $header).text();

            var getNewHeaderText = $('> a', element).contents().text().trim();

            // Add new breadcrumb
            if (options.link_type == 'breadcrumb') {
                if (!$('ul', $header).length) {
                    $($header).prepend(
                        '<ul class="' + options.header_class_list + '"></ul>'
                    );
                }

                if (getNewBreadcrumb == options.default_text) {
                    $('ul li:last-child', $header).remove();

                    $('ul', $header).append(
                        '<li class="first"><a href="#">' + options.reset_text + '</a></li>'
                    );
                } else {
                    $('ul li:last-child',$header).remove();

                    $('ul', $header).append(
                        '<li><a href="#">' + getNewBreadcrumb + '</a></li>'
                    );
                }

                $('ul', $header).append(
                    '<li class="active">' + getNewHeaderText + '</li>'
                );
            }

            if (options.link_type == 'backlink') {
                if (!$('a', $header).length) {
                    $($header).prepend(
                        '<a href="#" class="link-back">' + getNewBreadcrumb + '</a>'
                    );
                } else {
                    $('.link-back', $header).html(getNewBreadcrumb);
                }
            }

            if (options.link_type == 'link') {
                if (!$('a',$header).length) {
                    $($header).prepend(
                        '<ul><li class="first"><a href="#">' + options.reset_text + '</a></li></ul>'
                    );
                }
            }

            // Update header text
            updateHeader($header, getNewHeaderText);

            // declare child link
            var activeLink = $('> a', element);

            // add active class to link
            $(activeLink).addClass(options.active_class);

            var showObj = $('> ul', element);

            var drilldownHeight = showObj.height();

            $($drilldown).css({
                height: drilldownHeight+'px'
            });

            var $wrapper = $('#'+options.wrapper_id)
            drilldownHeightAll =
                drilldownHeight
                + $('#'+options.header_wrap).outerHeight(true)
                + $('.'+options.footer_class, $wrapper).outerHeight(true)
                + options.menu_padding;

            $(wrapper).css({height: drilldownHeightAll+'px'});

            $('> ul li', element).show();
            $('> ul', element).animate({"margin-right": 0}, options.speed);

            // Find all sibling items & hide
            $(element).siblings().hide();

            // If using breadcrumbs hide this element
            if (options.link_type != 'link') {
                $(activeLink).hide();
            }

            if (options.save_state == true) {
                createCookie($(wrapper).attr('id'), $drilldown);
            }

            if ( $(window).width() < 768 ) {
                setTimeout(function() {
                    $("body, html").animate({
                        scrollTop: $('#'+options.wrapper_id).offset().top - options.scroll_padding
                    });
                }, 80);
            }
        }

        function actionDrillUp(element, wrapper, $drilldown) {
            // Declare header
            var $header = $('.'+options.header_class, wrapper);

            var activeLink = $('> a',element);

            // Get width of menu for animating right
            var drilldownWidth = $($drilldown).outerWidth(true);

            $('ul', element).css('margin-right', -drilldownWidth + 'px');

            // Show all elements
            $(activeLink).addClass(options.active_class);

            $('> ul li, a', element).show();

            // Get new header text from clicked link
            var getNewHeaderText = $('> a', element).html();

            $(options.header_tag, $header).html(getNewHeaderText);

            if (options.link_type == 'breadcrumb') {
                $('a:gt(' + $(activeLink).index('.' + options.active_class, wrapper) + ')', $header).remove();
            }
        }

        function updateHeader($drilldown, html) {
            if ( !hasHeader($drilldown) ) {
                $($drilldown).append(
                    '<' + options.header_tag
                    + ' class="' + (options.show_header ? '' : 'hidden ') + options.header_tag_class
                    + '">'
                    + '</' + options.header_tag + '>'
                );
            }

            $(options.header_tag, $drilldown).html(html);
        }

        function hasHeader($drilldown) {
            return $(options.header_tag, $drilldown).length > 0;
        }

        // Reset using active links
        function resetDrilldown($drilldown, wrapper) {
            var $header = $('.'+options.header_class, wrapper);

            $('ul, a', $header).remove();

            $('li, a', $drilldown).show();

            var drilldownWidth = $($drilldown).outerWidth(true);

            if (options.link_type == "link") {
                if ($('a.' + options.active_class + ':last', $drilldown).parent('li').length) {
                    var lastActive = $('a.' + options.active_class + ':last', $drilldown).parent('li');

                    $('ul', lastActive).css('margin-right', -drilldownWidth + 'px');
                } else {
                    $('ul', $drilldown).css('margin-right', -drilldownWidth + 'px');
                }
            } else {
                $('ul', $drilldown).css('margin-right', -drilldownWidth + 'px');
            }

            updateHeader($header, options.default_text);

            // Add new breadcrumb
            if (options.link_type == 'breadcrumb') {
                var getNewBreadcrumb = $(options.header_tag,$header).text();

                if (!$('ul',$header).length) {
                    $($header).prepend(
                        '<ul class="' + options.header_class_list + '"></ul>'
                    );
                }

                if (getNewBreadcrumb == options.default_text) {
                    $('ul',$header).append(
                        '<li class="active">' + options.default_text + '</li>'
                    );
                }
            }

            var activeObj = $drilldown;

            $('a.' + options.active_class, $drilldown).each(function(i) {
                var $activeLi = $(this).parent('li').stop();

                actionDrillDown($activeLi, wrapper, $drilldown);

                activeObj = $(this).parent('li');
            });

            if ($('> ul', activeObj).length) {
                activeObj = $('> ul', activeObj);
            }

            var drilldownHeight = 0;

            $(activeObj).children('li').each(function() {
                drilldownHeight += $(this).outerHeight();
            });

            if (drilldownHeight) {
                var $wrapper = $('#'+options.wrapper_id),
                    drilldownHeightAll =
                        $('#'+options.header_wrap).outerHeight(true)
                        + drilldownHeight
                        + $('.'+options.footer_class, $wrapper).outerHeight(true)
                        + options.menu_padding;

                $(wrapper).css({
                    height: drilldownHeightAll + 'px'
                });

                $($drilldown).css(
                    {height: drilldownHeight + 'px'
                    });
            }
        }

        function checkSelected($drilldown, wrapper) {
            var activeArray = $('.'+options.class_selected, $drilldown).parents('li');

            $.each(activeArray, function(index,value) {
                $('> a',value).addClass(options.active_class);
            });

            return activeArray.length;
        }

        // Retrieve cookie value and set active items
        function checkCookie(cookieId, $drilldown) {
            var cookieVal = $.cookie(cookieId);

            if (cookieVal != null) {
                // create array from cookie string
                var activeArray = cookieVal.split(',');

                $.each(activeArray, function(index, value) {
                    // fix firefox root menu not shown
                    var $cookieLi = $('li:eq(' + parseInt(value) + ')', $drilldown);

                    $('> a', $cookieLi).addClass(options.active_class);
                });
            }
        }

        // Write cookie
        function createCookie(cookieId, $drilldown) {
            var activeIndex = [];

            // Create array of active items index value
            $('a.'+options.active_class,$drilldown).each(function() {
                activeIndex.push(
                    $('li',$drilldown).index( $(this).parent('li') )
                );
            });

            // Store in cookie
            $.cookie(cookieId, activeIndex, {path: '/'});
        }

        function resizeDrilldown($drilldown, $wrapper) {
            // set wrapper to auto width to force resize
            $($wrapper).css({
                width: 'auto'
            });

            $($drilldown).css({
                width: 'auto'
            });

            var drilldownWidth = $($wrapper).outerWidth(true);

            if (drilldownWidth) {
                $($wrapper).css({
                    width: drilldownWidth + 'px'
                });

                $($drilldown).css({
                    width: drilldownWidth + 'px'
                });

                $('li',$drilldown).each(function() {
                    $(this).css({
                        width: drilldownWidth + 'px'
                    });

                    $('ul',this).css({
                        width: drilldownWidth + 'px',
                        marginRight: '-' + drilldownWidth + 'px',
                        marginTop: '0'
                    });
                });

                resetDrilldown($drilldown, $wrapper);
            }
        }
    };
})(jQuery);
