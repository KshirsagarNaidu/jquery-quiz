
$(document).ready(function() {
    var makeCorrection = function($question) {
        $question.data('submitted', true);
        
        var correct = [], wrong = [];
        
        $('.quiz-checkbox, .quiz-radio', $question).each(function() {
            var $this = $(this);
            var $parent = $this.parent();
            
            if ( $parent.hasClass('quiz-answer') && $this.attr('checked') != undefined )
                // $parent.addClass('quiz-correct');
                correct.push($parent);
            else if ( $this.attr('checked') != undefined )
                // $parent.addClass('quiz-wrong');
                wrong.push($parent);
        });
        
        if ( wrong.length == 0 ) {
            $.each(correct, function(index, value) {
                $(this).addClass('quiz-correct');
            });
        } else {
            $('.quiz-checkbox, .quiz-radio', $question).each(function() {
                if ( $(this).is(':checked') )
                    $(this).parent().addClass('quiz-wrong');
            });
        }
    }
    
    var clearOptions = function($question) {
        $('.quiz-checkbox, .quiz-radio', $question)
            .removeAttr('checked')
            .parent()
            .removeClass('quiz-correct quiz-wrong');
    }
    
    var clearCorrection = function($question) {
        $('.quiz-checkbox, .quiz-radio', $question)
            .parent()
            .removeClass('quiz-correct quiz-wrong');
    }
    
    var counter = 1;
    $('.quiz .quiz-question').each(function() {
        var $this = $(this);
        counter++;
        
        var isSingle = true;
        // create a checkbox, if it's a multiple-choice question, otherwise, a radio
        if ( $this.hasClass('quiz-multiple') ) {
            var template = '<input type="checkbox" class="quiz-checkbox"/>';
            isSingle = false;
        } else {
            var template = '<input type="radio" class="quiz-radio" name="quiz-question-' + counter + '-radiogroup"/>';
            $this.addClass('quiz-single');
        }
        
        // add to each option
        $('.quiz-answer, .quiz-option', $this).each(function() {
            var $this = $(this);
            $this.addClass('quiz-option');
            $this.prepend(template);
        });
        
        var scope = $this;
        $('.quiz-checkbox, .quiz-radio', $this).each(function() {
            $(this).click(function() {
                if ( scope.data('submitted') == true ) {
                    clearCorrection(scope);
                    scope.data('submitted', false);
                }                
            });
        });
        // bind makeCorrection() to .quiz-submit elements
        $('.quiz-submit', $this).click(function() {
            makeCorrection(scope);
        });
        
        // bind clearOptions() to .quiz-reset elements
        $('.quiz-clear', $this).click(function() {
            clearOptions(scope);
        });
    });
});
