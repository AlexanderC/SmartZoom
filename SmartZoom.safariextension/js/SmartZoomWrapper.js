SmartZoomWrapper = (function($){
  var plugin = function() {
      var eventsNS = 'SmartZoom-event';
      var Classes = {
        container: "SmartZoom-container",
        box: "SmartZoom-box"
      };
      var $elements = null;
      var $body = null;

      return {
        _promise: function() {
          return {
            _then: undefined,
            _result: undefined,
            _trigger: function() {
              this._then(this._result);
            },
            result: function(result) {
              this._result = result;

              if(this._then) {
                this._trigger();
              }
            },
            then: function(callable) {
              this._then = callable;

              if(this._result) {
                this._trigger();
              }
            }
          };
        },
        listen: function() {
          safari.self.addEventListener('message', function(event) {
              if(event.name == eventsNS) {
                var metadata = JSON.parse(event.message) || {};
                var method = metadata.method;
                var arguments = metadata.arguments;

                if(method) {
                  SmartZoomWrapper[method].apply(SmartZoomWrapper, arguments);
                }
              }
          }, false);

          return this;
        },
        run: function() {
            this.stop();
            var $context = this;
            $elements = $("div, section, p, article");
            $body = $("body");

            $body.addClass(Classes.container);

            $elements.bind("mouseover.SmartZoom", function(event) {
              $(event.target).addClass(Classes.box);
            }).bind("mouseout.SmartZoom", function(event) {
              $(event.target).removeClass(Classes.box);
            }).bind("click.SmartZoom", function(event) {
              // Zoomerang.config({
              //   maxWidth: $(window).width(),
              //   maxHeight: 9999999999,
              //   deepCopy: true,
              //   onOpen: function() {
              //     $context.stop();
              //   },
              //   onClose: function() {
              //     $context.run();
              //   }
              // });
              //
              // Zoomerang.open(event.target);

              zoom.onZoom = function() {
                $context.stop();
              };
              zoom.onZoomOut = function() {
                $context.run();
              };

              zoom.to({
                element: event.target
              });
            });
        },
        stop: function() {
          if($body && $elements) {
            $("." + Classes.box).removeClass(Classes.box);
            $body.removeClass(Classes.container);
            $elements.unbind("mouseover.SmartZoom");
            $elements.unbind("mouseout.SmartZoom");
            $elements.unbind("click.SmartZoom");

            $body = null;
            $elements = null;
          }
        }
      };
  };

  return new plugin;
})(jQuery).listen();
