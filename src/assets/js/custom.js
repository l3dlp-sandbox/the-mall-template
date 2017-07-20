$(function () {
    var menuDrilldown = $('#menu-drilldown').drilldown({
        wrapper_class: 'hidden-md-up drilldown',
        wrapper_id: 'menu-drilldown-wrapper',
        menu_class: 'drilldown-menu',
        class_selected: 'selected',
        event_type: 'click',
        hover_delay: 300,
        speed: 'fast',
        save_state: false,
        show_count: false,
        count_class: 'dd-count',
        icon_class: 'fa fa-angle-right pull-right dd-icon',
        link_type: 'breadcrumb',
        reset_text: '<i class="fa fa-chevron-left"></i>&nbsp;&nbsp;previous&nbsp;',
        default_text: 'Select a menu item',
        show_end_nodes: false,
        hide_empty: true,
        menu_height: false,
        show_header: false,
        header_tag: 'div',
        header_tag_class: 'list-group-item active',
        init_padding: 55,
        scroll_padding: 4,
        responsive: {
            lg: {
                init: 'hide',
                change: 'hide'
            },
            md: {
                init: 'hide',
                change: 'hide'
            },
            sm: {
                init: 'hide',
                change: 'hide'
            },
            xs: {
                init: 'hide',
                change: 'keep'
            }
        }
    });

    $('#menu-drilldown-toggle').click(function () {
        if ($(this).data('target')) {
            $el = $($(this).data('target'));

            $el.slideToggle();

            if ($el.data('collapsed') === 'collapsed') {
                $el.removeData('collapsed')
            } else {
                $el.data('collapsed', 'collapsed')
            }

            $("body, html").animate({
                scrollTop: $('.navbar-main').offset().top
            });
        }
    });

    $('input[data-read-only-suffix], textarea[data-read-only-suffix]').each(function() {
        var $el = $(this);

        $el.readOnlySuffix($el.data('readOnlySuffix'));
    });

    $.fn.select2.defaults.set("theme", "the-mall");
    $('.select2-init').select2({
        minimumResultsForSearch: Infinity
    });

    var singleSliderConfiguration = {
        items: 1,
        nav: true,
        dots: true,
        navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        loop: true
    };

    var productBoxCarouselConfiguration = {
        nav: true,
        dots: false,
        navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        loop: true,
        margin: 15,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    };

    $('.fullscreen-carousel').owlCarousel(singleSliderConfiguration);
    $('.product-carousel').owlCarousel(singleSliderConfiguration);
    $('.product-box-carousel').owlCarousel(productBoxCarouselConfiguration);

});
