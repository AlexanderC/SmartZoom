SmartZoom = (function($){
  var plugin = function() {
      var eventsNS = 'SmartZoom-event';

      return {
        _started: false,
        _currentTab: undefined,
        listen: function() {
          var $context = this;

          safari.application.addEventListener("command", function(event) {
            if (event.command == "smart_zoom-run") {
              if($context._started) {
                SmartZoom.stop();
                $context._started = false;
              } else {
                SmartZoom.run();
                $context._started = true;
              }
            }
          }, false);

          return this;
        },
        wrapperCall: function(method, arguments, callback) {
          safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(
            eventsNS,
            JSON.stringify({method: method, arguments: arguments || []})
          );
        },
        run: function() {
          SmartZoom.wrapperCall("run");
        },
        stop: function() {
          SmartZoom.wrapperCall("stop");
        }
      };
  };

  return new plugin;
})(jQuery);
