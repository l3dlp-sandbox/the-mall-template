$('.range-slider').each(function () {

    var $el            = $(this),
        $wrapper       = $el.parent().parent(),
        inputMin       = $('input' + $el.data('rangeTargetMin'), $wrapper),
        inputMax       = $('input' + $el.data('rangeTargetMax'), $wrapper),
        setFocus       = '',
        formatOptions  = {
            decimals: 0
        };

    if ($el.data('unitType') !== "") {
        formatOptions.postfix = $el.data('unitType');
    }

    var slider = noUiSlider.create(this, {
        start:     [$el.data('rangeCurrentMin'), $el.data('rangeCurrentMax')],
        step:      1,
        margin:    10,
        connect:   true,
        behaviour: 'tap-drag',
        mark:      ',',
        range: {
            'min': $el.data('rangeMin'),
            'max': $el.data('rangeMax')
        },
        tooltips:  [false, false],
        format:    wNumb(formatOptions)
    });



    if (inputMin.is('input')) {
        var currentInputMinValue = parseInt(inputMin.val());
        if (currentInputMinValue !== parseInt($el.data('rangeMin'))) {
            inputMin.val(currentInputMinValue);
        } else {
            inputMin.val(parseInt($el.data('rangeMin')));
        }
    } else {
        inputMin.html(parseInt($el.data('rangeMin')));
    }

    if (inputMax.is('input')) {
        var currentInputMaxValue = parseInt(inputMax.val());
        if (currentInputMaxValue !== parseInt($el.data('rangeMax'))) {
            inputMax.val(currentInputMaxValue);
        } else {
            inputMax.val(parseInt($el.data('rangeMax')));
        }
    } else {
        inputMax.html(parseInt($el.data('rangeMax')));
    }

    slider.on('slide', function (values, handle) {
        var rangeValues = [$el.data('rangeTargetMin'), $el.data('rangeTargetMax')];

        $.each($(rangeValues[handle]), function () {
            var $this = $(this);

            if ($this.is('input')) {
                $this.val(parseInt(values[handle]) + ' ' + $el.data('unitType'));
            } else {
                $this.html(parseInt(values[handle]) + ' ' + $el.data('unitType'));
            }
        });

    });

    inputMin.on('change', function (e) {
        var evTarget = $(e.target),
            value    = evTarget.val(),
            suffix = evTarget.data('readOnlySuffix');

        if (suffix) {
            value = value.substring(0, value.indexOf(suffix));
        }


        slider.set([value, null]);
    });

    inputMax.on('change', function (e) {
        var evTarget = $(e.target),
            value    = evTarget.val(),
            suffix   = evTarget.data('readOnlySuffix');

        if (suffix) {
            value = value.substring(0, value.indexOf(suffix));
        }

        slider.set([null, value]);
    });

});
