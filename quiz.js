
(function( $ ) {

QuizSingleHandler = function (question, idQuestion) {
    this.question = question;
    this.idQuestion = idQuestion;
}

QuizSingleHandler.prototype = {

    makeCorrection: function(self) {
        // when used as a callback, self will be passed as parameter,
        // since 'this' will be overridden by jquery
        self = (self == undefined) ? this : self;
        self.question.data('submitted', true);
        
        $('.quiz-radio:checked', self.question).each(function() {
            var $radio = $(this);
            var $option = $radio.parent();
            
            if ( $option.hasClass('quiz-answer') )
                $option.addClass('quiz-correct');
            else
                $option.addClass('quiz-wrong');
        });
    },
    
    clearOptions: function(self) {    
        self = (self == undefined) ? this : self;
        $('.quiz-radio', self.question).removeAttr('checked');
        self.clearCorrection();
    },
    
    clearCorrection: function(self) {
        self = (self == undefined) ? this : self;
        
        if ( self.question.data('submitted') == true ) {
            $('.quiz-option', self.question).removeClass('quiz-correct quiz-wrong');

            self.question.data('submitted', false);
        }                
    },
    
    init: function() {   
        var self = this;
        
        var template = Mustache.compile('<input type="radio" class="quiz-radio" ' +
        'name="quiz-question-{{idQuestion}}-options" ' +
        'id="quiz-question-{{idQuestion}}-option-{{numOption}}"/>' +
        '<label for="quiz-question-{{idQuestion}}-option-{{numOption}}">{{label}}</label>');
        
        // creates radio buttons for the quiz

        var numOption = 0;
        $('.quiz-answer, .quiz-option', self.question).each(function() {
            var $this = $(this);
            $this.addClass('quiz-option');
            $this.html(template({
                idQuestion: self.idQuestion, 
                numOption: ++numOption, 
                label: $this.html() 
            }));
        });
        
        // bind clearOptions to the quiz-clear elements, if any
        $('.quiz-clear', self.question).each(function() {
            $(this).bind('click.clearOptions', function() { self.clearOptions(self) });
        });
       
        // clear correction if there are correct/wrong classes but the options checked changed
        $('.quiz-radio', self.question).each(function() {
            $(this).bind('click.clearCorrection', function() { self.clearCorrection(self) });
        });

        
        // bind makeCorrection to the quiz-submit elements, if any
        $('.quiz-submit', self.question).each(function() {
            $(this).bind('click.makeCorrection', function() { self.makeCorrection(self) });
        });

    }
}

QuizMultipleHandler = function (question, idQuestion) {
    this.question = question;
    this.idQuestion = idQuestion;
}

QuizMultipleHandler.prototype = {

    makeCorrection: function(self) {
        self = (self == undefined) ? this : self;
        self.question.data('submitted', true);
        
        var isCorrect = true;
        

        $('.quiz-checkbox', self.question).each(function() {
            var $checkbox = $(this);
            var $option = $checkbox.parent();
            
            isCorrect = isCorrect && 
                ($option.hasClass('quiz-answer') == $checkbox.is(':checked'));
        });
        
        $('.quiz-checkbox:checked', self.question).each(function() {
            var $radio = $(this);
            var $option = $radio.parent();
            
            if ( isCorrect )
                $option.addClass('quiz-correct');
            else
                $option.addClass('quiz-wrong');
        });
    },
    
    clearOptions: function(self) {    
        self = (self == undefined) ? this : self;
        $('.quiz-checkbox', self.question).removeAttr('checked');
        self.clearCorrection();
    },
    
    clearCorrection: function(self) {
        self = (self == undefined) ? this : self;
        
        if ( self.question.data('submitted') == true ) {
            $('.quiz-option', self.question).removeClass('quiz-correct quiz-wrong');

            self.question.data('submitted', false);
        }                
    },
    

    init: function() {   
        var self = this;
        
        var template = Mustache.compile('<input type="checkbox" class="quiz-checkbox" ' +
        'id="quiz-question-{{idQuestion}}-option-{{numOption}}"/>' +
        '<label for="quiz-question-{{idQuestion}}-option-{{numOption}}">{{label}}</label>');
        
        var numOption = 0;

        $('.quiz-answer, .quiz-option', self.question).each(function() {
            var $this = $(this);
            $this.addClass('quiz-option');
            $this.html(template({
                idQuestion: self.idQuestion, 
                numOption: ++numOption, 
                label: $this.html() 
            }));
        });
        
        $('.quiz-clear', self.question).each(function() {
            $(this).bind('click.clearOptions', function() { self.clearOptions(self) });
        });
       
        $('.quiz-checkbox', self.question).each(function() {
            $(this).bind('click.clearCorrection', function() { self.clearCorrection(self) });
        });
        
        $('.quiz-submit', self.question).each(function() {
            $(this).bind('click.makeCorrection', function() { self.makeCorrection(self) });
        });
    }
}

$.quiz = function($context) {
    var self = $.quiz;
    // if no context is given, set it as document  
    $context = ($context == undefined) ? $(document) : $context;
    var handler = self.getHandler($context);
    
    // if it doesn't have a handler, check all children for handlers
    if ( handler == undefined ) {
        for (handler in self.handlers)
            $('.' + handler, $context).each(function() {
                var $this = $(this);
                var newQuiz = new self.handlers[handler]($this, self.getId($this));
                self.quizzes.push(newQuiz);
                newQuiz.init();
            });
    } // if it has, make it a quiz
    else {
        var newQuiz = new self.handlers[handler]($context, self.getId($context));
        self.quizzes.push(newQuiz);
        newQuiz.init();
    }
}

$.quiz.getId = function($element) {
    self.counter = (self.counter == undefined) ? 0 : self.counter;
    if ( $element.attr('id') != undefined )
        return $element.attr('id');
    else
        return ++self.counter;
}

$.quiz.getHandler = function($context) {
    for (var handler in $.quiz.handlers)
        if ( $context.hasClass(handler) ) 
            return handler;
    
    return undefined;
}

$.quiz.handlers = {
    'quiz-single': QuizSingleHandler,
    'quiz-multiple': QuizMultipleHandler
    // 'quiz-objective': QuizObjectiveHandler
};

$.quiz.quizzes = [];

$.fn.quiz = function() {
    $.quiz(this);
    return this;
}

})(jQuery);
