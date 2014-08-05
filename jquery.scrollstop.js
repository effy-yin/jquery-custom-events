/*
* Special scroll events for jQuery
* The only way to simulate such an event would be to have a delay between the last scrolling action and the event itself 
* – a timer could start on every “scroll” event and then if that timer is not cleared in time (say 500 milliseconds) 
* then it can be assumed a user has “stopped scrolling”, 
* or, has taken a break from a lengthy scroll; 
* either circumstance warrants a “scrollstop” event in my opinion.
* While we’re at it we may as well add a “scrollstart” event 
* – this will only fire once at the start of each scrolling session.
* Now we can use our two new events as if they were native DOM events (within jQuery). 
* And, because we’ve used the “Special Events” API our events are immediately operable via all event methods, 
* like bind, one, and unbind.
*/
(function($){
    
    var special = $.event.special,
        uid1 = "D" + (+new Date()),
        uid2 = "D" + (+new Date() + 1);
        
    special.scrollstart = {
        setup: function() {            
            var timer,
                handler =  function(evt) {
                    var _self = this,
                        _args = arguments;
                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = "scrollstart";
                        $.event.dispatch.apply(_self, _args);
                    }
                    timer = setTimeout( function(){
                        timer = null;
                    }, special.scrollstop.latency);
                };
            $(this).bind("scroll", handler).data(uid1, handler);            
        },
        teardown: function(){
            $(this).unbind("scroll", $(this).data(uid1) );
        }
    };
    
    special.scrollstop = {
        latency: 300,
        setup: function() {            
            var timer,
                handler = function(evt) {
                    var _self = this,
                        _args = arguments;
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout( function(){                        
                        timer = null;
                        evt.type = "scrollstop";
                        $.event.dispatch.apply(_self, _args);
                    }, special.scrollstop.latency);                    
                };
            $(this).bind("scroll", handler).data(uid2, handler);
        },
        teardown: function() {
            $(this).unbind("scroll", $(this).data(uid2) );
        }
    };

    // 声明快捷方式：$(elem).scrollstart(function () {});
    $.fn.scrollstart = function (callback) {
        return this.bind('scrollstart', callback);
    };
    // 声明快捷方式：$(elem).scrollstop(function () {});
    $.fn.scrollstop = function (callback) {
        return this.bind('scrollstop', callback);
    };
    
})(jQuery);