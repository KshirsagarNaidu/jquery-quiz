
QuizSingleHandler = function (question, numQuestion) {
    this.question = question;
    this.numQuestion = numQuestion;
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
        'name="quiz-question-{{numQuestion}}-options" ' +
        'id="quiz-question-{{numQuestion}}-option-{{numOption}}"/>' +
        '<label for="quiz-question-{{numQuestion}}-option-{{numOption}}">{{label}}</label>');
        
        // creates radio buttons for the quiz
        var numOption = 0;
        $('.quiz-answer, .quiz-option', self.question).each(function() {
            var $this = $(this);
            $this.addClass('quiz-option');
            $this.html(template({
                numQuestion: self.numQuestion, 
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

QuizMultipleHandler = function (question, numQuestion) {
    this.question = question;
    this.numQuestion = numQuestion;
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
        'id="quiz-question-{{numQuestion}}-option-{{numOption}}"/>' +
        '<label for="quiz-question-{{numQuestion}}-option-{{numOption}}">{{label}}</label>');
        
        var numOption = 0;
        $('.quiz-answer, .quiz-option', self.question).each(function() {
            var $this = $(this);
            $this.addClass('quiz-option');
            $this.html(template({
                numQuestion: self.numQuestion, 
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

QuizJs = {
    handlers: {
        'quiz-single': QuizSingleHandler,
        'quiz-multiple': QuizMultipleHandler
        // 'quiz-objective': QuizObjectiveHandler
    },
    
    quizzes: [],
    
    init: function() {
        var self = this;
        var counter = 0;
        
        for (var handler in self.handlers)
            $('.quiz .' + handler).each(function() {
                var newQuiz = new self.handlers[handler]($(this), ++counter);
                self.quizzes.push(newQuiz);
                newQuiz.init();
            });
    },

};
