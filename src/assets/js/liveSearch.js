function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
            clearTimeout(timeout);
        }
        function delayed() {
            fn();
            timeout = null;
        }

        timeout = setTimeout(delayed, threshold || 100);
    }
}

function liveSearch(context, uuid) {
    var _this = context;
    var resultBox = 'suggestions_' + uuid;

    function buildHtmlResult(jsonResult, phraseToWrap) {
        var html = '';

        $.each(jsonResult, function (index, value) {
            html = html + '<div class="suggestion"><div class="row">';

            if (value.name.match(phraseToWrap)) {
                value.name = value.name.replace(phraseToWrap, '<mark>' + phraseToWrap + '</mark>');
            }

            if (value.image !== '') {
                html = html + '<div class="col-4 col-sm-2 col-md-3"><a href="#"><img class="img-thumbnail img-fluid" src="' + value.image + '" alt="' + value.name + '"/></a></div>';
                html = html + '<div class="col-8 col-sm-10 col-md-9">';
            } else {
                html = html + '<div class="col-12">';
            }

            html = html + ' <p class="suggestion-name"><a href="#">' + value.name + '</a></p></div></div></div>';
        });

        return html;
    }

    var currentRequest = null;

    function performSearch($el) {
        try {
            currentRequest.abort();
        } catch (e) {
        }

        var $searchVal = $el.val();
        var $resultBoxElement = $('#' + resultBox);

        if ($searchVal.length === 0) {
            $resultBoxElement.hide().html('');
        }

        if ($searchVal.length > 1) {
            if ($resultBoxElement.html() === '') {
                $resultBoxElement.html('<div class="loading-indicator"><i class="fa fa-refresh fa-spin fa-2x fa-fw"></i></div>');
            }
            $resultBoxElement.show();
            var data = {};
            data['search'] = $searchVal;

            currentRequest = $.get('/json/ajax-search-test.json', function (response) {
                if (response === '') {
                    $resultBoxElement.hide();
                    return false;
                }
                $resultBoxElement.html(buildHtmlResult(response, $searchVal));
            });
        }
    }

    _this
        .wrap('<div class="' + resultBox + '-wrapper search-wrapper"></div>')
        .after('<div id="' + resultBox + '" class="suggestions-box" style="display: none"></div>')
        .attr('autocomplete', 'off')
        .on('click keyup', function (e) {
            debounce(performSearch($(e.currentTarget)), 400)
        });

    _this.closest('form').on('submit', function () {
        $('#' + resultBox).remove();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#' + resultBox).length && !$(e.target).closest(_this).length)
            $('#' + resultBox).hide().html('');
    });
}

$(document).ready(function () {
    $('.ajax-search').each(function () {
        liveSearch($(this), Math.random().toString(16).slice(2));
    });

});

