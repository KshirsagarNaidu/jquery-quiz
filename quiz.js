
$(document).ready(function() {
    var counter = 1;
    $('.quiz-question').each(function() {
        $this = $(this);
        
        if ( $this.attr('data-mode') == 'single' ) 
            template = '<input name="quiz-question-' + counter + '-radiogroup" type="radio" />';
        else
            template = '<input type="checkbox"/>';
        
        $('li', this).each(function() {
            $this = $(this);
            $this.addClass('quiz-choice-not-selected');
            $this.css('list-style-type', 'none');
            $this.prepend(template);
        });
    });
});
