
Foo = function() { }

Foo.prototype = {
    message: "Hello World",
    
    setButtonMessage: function() {
        var $button = $('#button');
        $button.unbind('click.showMessage');
        $button.bind('click.showMessage', function() {
            alert(this.message);
        });
    }
}
