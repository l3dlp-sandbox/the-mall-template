var hideEndFade;

hideEndFade = function($scrollingTabs) {
    return $scrollingTabs.each(function() {
        var $this;
        $this = $(this);
        return $this.toggleClass('scrolling-right-active', $this.width() < $this.prop('scrollWidth'));
    });
};

$(function () {
    var horizontalScrolling = $('.scrolling-horizontal');
    horizontalScrolling.perfectScrollbar();
    hideEndFade(horizontalScrolling);
    $(window).resize(function () {
        horizontalScrolling.perfectScrollbar('update');
        hideEndFade(horizontalScrolling);
    });
    horizontalScrolling.on('ps-scroll-x', function (event) {
        var $this, currentPosition, maxPosition;
        $this           = $(event.currentTarget);
        currentPosition = $this.scrollLeft();
        maxPosition     = $this.prop('scrollWidth') - $this.outerWidth();
        $this.toggleClass('scrolling-left-active', currentPosition > 0);
        return $this.toggleClass('scrolling-right-active', currentPosition < maxPosition - 1);
    });
    horizontalScrolling.click(function (event) {
        var windowWidth = $(window).width();
        if (!horizontalScrolling.hasClass(event.target.className)) {
            return true;
        }

        if (event.offsetX < windowWidth / 2 ) {
            horizontalScrolling.animate({scrollLeft: horizontalScrolling.scrollLeft() - 50}, 250);
        }

        if (event.offsetX > windowWidth / 2 ) {
            horizontalScrolling.animate({scrollLeft: horizontalScrolling.scrollLeft() + 50}, 250);
        }

        horizontalScrolling.perfectScrollbar('update');

        return false;
    });
});
