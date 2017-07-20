$(function () {
    $('.mega-menu')
        .hover(function (e) {
            $(e.currentTarget).addClass('show');
        }, function (e) {
            $(e.currentTarget).removeClass('show');
        })
        .on('show.bs.dropdown', function (e) {
            $(e.currentTarget).addClass('show');
        })
        .on('hide.bs.dropdown', function (e) {
            $(e.currentTarget).removeClass('show');
        });

    $('.mega-menu > .dropdown-menu').click(function (e) {
        if (e.target.tagName.toLowerCase() !== 'a' && e.offsetParent && e.offsetParent.tagName.toLowerCase() !== 'a') {
            e.preventDefault();
            e.stopPropagation();
        }
    });


    $('.mega-menu > a').mouseup(function () {
        var href = $(this).attr("href");

        if (!$.isTouch && (href != '')) {
            window.location = $(this).attr("href");
        }
    });
});
