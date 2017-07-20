(function($) {
    $.fn.readOnlySuffix = function(suffix) {
        return this.each(function() {
            var $this = $(this),
                suffixLength = suffix.length,
                oldValue = $this.val(),
                mouseIsDown = false;

            // Must be a text input or text area
            if (!($this.is(":text") || $this.tagName.toLowerCase() === "textarea")){
                return;
            }

            if ( $this.val().indexOf(suffix) === -1 ) {
                $this.val(oldValue + suffix);
            }

            $this.keydown(function(evt){
                if (mouseIsDown){
                    // Handle issue when cursor is dragged out of input and mouseup is not fired.
                    evt.preventDefault();

                    $this.trigger("mouseup");

                    return;
                }

                // Prevent keys that will delete the suffix
                var inputLength = this.value.length,
                    offset = inputLength - suffixLength;

                if (
                    (evt.keyCode === 35 || evt.keyCode === 39 || evt.keyCode === 46) // Home, Right Arrow or Delete keys
                    && this.selectionStart >= offset
                ) {
                    evt.preventDefault();
                }
            });

            $this.keyup(function(evt){
                // Prevent Select All
                var offset = this.value.length - suffixLength,
                    actualStart = this.selectionStart > offset ? offset : this.selectionStart,
                    actualEnd = this.selectionEnd > offset ? offset : this.selectionEnd;

                if (this.selectionStart !== actualStart || this.selectionEnd !== actualEnd){
                    this.setSelectionRange(actualStart, actualEnd);
                }
            });

            $this.mousedown(function(evt){
                oldValue = $this.val();
                mouseIsDown = true;
            });

            $this.mouseup(function(evt){
                var newValue = $this.val(),
                    offset = oldValue.length - suffixLength,
                    actualStart = this.selectionStart > offset ? offset : this.selectionStart,
                    actualEnd = this.selectionEnd > offset ? offset : this.selectionEnd;

                mouseIsDown = false;

                if (newValue !== oldValue){
                    $this.val(oldValue);
                }

                if (this.selectionStart !== actualStart || this.selectionEnd !== actualEnd){
                    this.setSelectionRange(actualStart, actualEnd);
                }
            });
        });
    };
})(jQuery);
