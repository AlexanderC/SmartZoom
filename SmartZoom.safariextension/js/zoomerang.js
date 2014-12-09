// /*
// * zoomerang.js - http://yyx990803.github.io/zoomerang/
// */
//
// (function () {
//
//   // regex
//   var percentageRE = /^([\d\.]+)%$/
//
//   // elements
//   var overlay = document.createElement('div'),
//   wrapper = document.createElement('div'),
//   target,
//   parent,
//   placeholder
//
//   // state
//   var shown = false,
//   lock  = false,
//   originalStyles
//
//   // options
//   var options = {
//     transitionDuration: '.4s',
//     transitionTimingFunction: 'cubic-bezier(.4,0,0,1)',
//     bgColor: '#fff',
//     bgOpacity: 1,
//     maxWidth: 300,
//     maxHeight: 300,
//     onOpen: null,
//     onClose: null
//   }
//
//   // compatibility stuff
//   var trans = sniffTransition(),
//   transitionProp = trans.transition,
//   transformProp = trans.transform,
//   transformCssProp = transformProp.replace(/(.*)Transform/, '-$1-transform'),
//   transEndEvent = trans.transEnd
//
//   setStyle(overlay, {
//     position: 'fixed',
//     display: 'none',
//     zIndex: 99998,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     opacity: 0,
//     backgroundColor: options.bgColor,
//     transition: 'opacity ' +
//     options.transitionDuration + ' ' +
//     options.transitionTimingFunction
//   })
//
//   setStyle(wrapper, {
//     position: 'fixed',
//     zIndex: 99999,
//     top: '50%',
//     left: '50%',
//     width: 0,
//     height: 0
//   })
//
//   // helpers ----------------------------------------------------------------
//
//   function setStyle (el, styles, remember) {
//     checkTrans(styles)
//     var s = el.style,
//     original = {}
//     for (var key in styles) {
//       if (remember) {
//         original[key] = s[key] || ''
//       }
//       s[key] = styles[key]
//     }
//     return original
//   }
//
//   function sniffTransition () {
//     var ret   = {},
//     trans = ['webkitTransition', 'transition', 'mozTransition'],
//     tform = ['webkitTransform', 'transform', 'mozTransform'],
//     end   = {
//       'transition'       : 'transitionend',
//       'mozTransition'    : 'transitionend',
//       'webkitTransition' : 'webkitTransitionEnd'
//     }
//     trans.some(function (prop) {
//       if (overlay.style[prop] !== undefined) {
//         ret.transition = prop
//         ret.transEnd = end[prop]
//         return true
//       }
//     })
//     tform.some(function (prop) {
//       if (overlay.style[prop] !== undefined) {
//         ret.transform = prop
//         return true
//       }
//     })
//     return ret
//   }
//
//   function checkTrans (styles) {
//     if (styles.transition) {
//       styles[transitionProp] = styles.transition
//     }
//     if (styles.transform) {
//       styles[transformProp] = styles.transform
//     }
//   }
//
//   var stylesToCopy = [
//   'position', 'display', 'float',
//   'top', 'left', 'right', 'bottom',
//   'marginBottom', 'marginLeft', 'marginRight',
//   'marginTop', 'font', 'lineHeight', 'verticalAlign'
//   ]
//
//   function copy (el, box) {
//     var styles = getComputedStyle(el),
//     ph = document.createElement('div'),
//     i = stylesToCopy.length, key
//     while (i--) {
//       key = stylesToCopy[i]
//       ph.style[key] = styles[key]
//     }
//     setStyle(ph, {
//       visibility: 'hidden',
//       width: box.width + 'px',
//       height: box.height + 'px',
//       display: styles.display === 'inline'
//       ? 'inline-block'
//       : styles.display
//     })
//     if (options.deepCopy) {
//       ph.innerHTML = el.innerHTML
//     } else {
//       ph.textContent = el.textContent
//     }
//     return ph
//   }
//
//   var api = {
//
//     config: function (opts) {
//
//       if (!opts) return options
//         for (var key in opts) {
//           options[key] = opts[key]
//         }
//         setStyle(overlay, {
//           backgroundColor: options.bgColor,
//           transition: 'opacity ' +
//           options.transitionDuration + ' ' +
//           options.transitionTimingFunction
//         })
//         return this
//       },
//
//       open: function (el, cb) {
//
//         if (shown || lock) return
//
//           target = typeof el === 'string'
//           ? document.querySelector(el)
//           : el
//
//           shown = true
//           lock = true
//           parent = target.parentNode
//
//           var p     = target.getBoundingClientRect(),
//           scale = Math.min(options.maxWidth / p.width, options.maxHeight / p.height),
//           dx    = p.left - (window.innerWidth - p.width) / 2,
//           dy    = p.top - (window.innerHeight - p.height) / 2
//
//           placeholder = copy(target, p)
//
//           originalStyles = setStyle(target, {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: '',
//             bottom: '',
//             whiteSpace: 'nowrap',
//             marginTop: -p.height / 2 + 'px',
//             marginLeft: -p.width / 2 + 'px',
//             transform: 'translate(' + dx + 'px, ' + dy + 'px)',
//             transition: ''
//           }, true)
//
//           // deal with % width and height
//           var wPctMatch = target.style.width.match(percentageRE),
//           hPctMatch = target.style.height.match(percentageRE)
//           if (wPctMatch || hPctMatch) {
//             var wPct = wPctMatch ? +wPctMatch[1] / 100 : 1,
//             hPct = hPctMatch ? +hPctMatch[1] / 100 : 1
//             setStyle(wrapper, {
//               width: ~~(p.width / wPct) + 'px',
//               height: ~~(p.height / hPct) + 'px'
//             })
//           }
//
//           // insert overlay & placeholder
//           parent.appendChild(overlay)
//           parent.appendChild(wrapper)
//           parent.insertBefore(placeholder, target)
//           wrapper.appendChild(target)
//           overlay.style.display = 'block'
//
//           // force layout
//           var force = target.offsetHeight
//
//           // trigger transition
//           overlay.style.opacity = options.bgOpacity
//           setStyle(target, {
//             transition:
//             transformCssProp + ' ' +
//             options.transitionDuration + ' ' +
//             options.transitionTimingFunction,
//             transform: 'scale(' + scale + ')'
//           })
//
//           target.addEventListener(transEndEvent, function onEnd () {
//             target.removeEventListener(transEndEvent, onEnd)
//             lock = false
//             cb = cb || options.onOpen
//             if (cb) cb(target)
//             })
//
//
//
//             return this
//           },
//
//           close: function (cb) {
//
//             if (!shown || lock) return
//               lock = true
//
//               var p  = placeholder.getBoundingClientRect(),
//               dx = p.left - (window.innerWidth - p.width) / 2,
//               dy = p.top - (window.innerHeight - p.height) / 2
//
//               overlay.style.opacity = 0
//               setStyle(target, {
//                 transform: 'translate(' + dx + 'px, ' + dy + 'px)'
//               })
//
//               target.addEventListener(transEndEvent, function onEnd () {
//                 target.removeEventListener(transEndEvent, onEnd)
//                 setStyle(target, originalStyles)
//                 parent.insertBefore(target, placeholder)
//                 parent.removeChild(placeholder)
//                 parent.removeChild(overlay)
//                 parent.removeChild(wrapper)
//                 overlay.style.display = 'none'
//                 placeholder = null
//                 shown = false
//                 lock = false
//                 cb = typeof cb === 'function'
//                 ? cb
//                 : options.onClose
//                 if (cb) cb(target)
//                 })
//
//                 return this
//               },
//
//               listen: function listen (el) {
//
//                 if (typeof el === 'string') {
//                   var els = document.querySelectorAll(el),
//                   i = els.length
//                   while (i--) {
//                     listen(els[i])
//                   }
//                   return
//                 }
//
//                 el.addEventListener('click', function (e) {
//                   e.stopPropagation()
//                   if (shown) {
//                     api.close()
//                   } else {
//                     api.open(el)
//                   }
//                 })
//
//                 return this
//               }
//             }
//
//             overlay.addEventListener('click', api.close)
//             wrapper.addEventListener('click', api.close)
//
//             // umd expose
//             if (typeof exports == "object") {
//               module.exports = api
//             } else if (typeof define == "function" && define.amd) {
//               define(function(){ return api })
//             } else {
//               this.Zoomerang = api
//             }
//           })();

/*!
* zoom.js 0.3
* http://lab.hakim.se/zoom-js
* MIT licensed
*
* Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
*/
var zoom = (function(){

  // The current zoom level (scale)
  var level = 1;

  // The current mouse position, used for panning
  var mouseX = 0,
  mouseY = 0;

  // Timeout before pan is activated
  var panEngageTimeout = -1,
  panUpdateInterval = -1;

  // Check for transform support so that we can fallback otherwise
  var supportsTransforms = 	'WebkitTransform' in document.body.style ||
  'MozTransform' in document.body.style ||
  'msTransform' in document.body.style ||
  'OTransform' in document.body.style ||
  'transform' in document.body.style;

  if( supportsTransforms ) {
    // The easing that will be applied when we zoom in/out
    document.body.style.transition = 'transform 0.8s ease';
    document.body.style.OTransition = '-o-transform 0.8s ease';
    document.body.style.msTransition = '-ms-transform 0.8s ease';
    document.body.style.MozTransition = '-moz-transform 0.8s ease';
    document.body.style.WebkitTransition = '-webkit-transform 0.8s ease';
  }

  // Zoom out if the user hits escape
  document.addEventListener( 'keyup', function( event ) {
    if( level !== 1 && event.keyCode === 27 ) {
      zoom.out();
    }
  } );

  // Monitor mouse movement for panning
  document.addEventListener( 'mousemove', function( event ) {
    if( level !== 1 ) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  } );

  /**
  * Applies the CSS required to zoom in, prefers the use of CSS3
  * transforms but falls back on zoom for IE.
  *
  * @param {Object} rect
  * @param {Number} scale
  */
  function magnify( rect, scale ) {

    var scrollOffset = getScrollOffset();

    // Ensure a width/height is set
    rect.width = rect.width || 1;
    rect.height = rect.height || 1;

    // Center the rect within the zoomed viewport
    rect.x -= ( window.innerWidth - ( rect.width * scale ) ) / 2;
    rect.y -= ( window.innerHeight - ( rect.height * scale ) ) / 2;

    if( supportsTransforms ) {
      // Reset
      if( scale === 1 ) {
        document.body.style.transform = '';
        document.body.style.OTransform = '';
        document.body.style.msTransform = '';
        document.body.style.MozTransform = '';
        document.body.style.WebkitTransform = '';
      }
      // Scale
      else {
        var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
        transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';

        document.body.style.transformOrigin = origin;
        document.body.style.OTransformOrigin = origin;
        document.body.style.msTransformOrigin = origin;
        document.body.style.MozTransformOrigin = origin;
        document.body.style.WebkitTransformOrigin = origin;

        document.body.style.transform = transform;
        document.body.style.OTransform = transform;
        document.body.style.msTransform = transform;
        document.body.style.MozTransform = transform;
        document.body.style.WebkitTransform = transform;
      }
    }
    else {
      // Reset
      if( scale === 1 ) {
        document.body.style.position = '';
        document.body.style.left = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.zoom = '';
      }
      // Scale
      else {
        document.body.style.position = 'relative';
        document.body.style.left = ( - ( scrollOffset.x + rect.x ) / scale ) + 'px';
        document.body.style.top = ( - ( scrollOffset.y + rect.y ) / scale ) + 'px';
        document.body.style.width = ( scale * 100 ) + '%';
        document.body.style.height = ( scale * 100 ) + '%';
        document.body.style.zoom = scale;
      }
    }

    level = scale;
  }

  /**
  * Pan the document when the mosue cursor approaches the edges
  * of the window.
  */
  function pan() {
    var range = 0.12,
    rangeX = window.innerWidth * range,
    rangeY = window.innerHeight * range,
    scrollOffset = getScrollOffset();

    // Up
    if( mouseY < rangeY ) {
      window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( mouseY / rangeY ) ) * ( 14 / level ) );
    }
    // Down
    else if( mouseY > window.innerHeight - rangeY ) {
      window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - mouseY ) / rangeY ) * ( 14 / level ) );
    }

    // Left
    if( mouseX < rangeX ) {
      window.scroll( scrollOffset.x - ( 1 - ( mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
    }
    // Right
    else if( mouseX > window.innerWidth - rangeX ) {
      window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
    }
  }

  function getScrollOffset() {
    return {
      x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
      y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
    }
  }

  return {
    onZoom: undefined,
    onZoomOut: undefined,
    /**
    * Zooms in on either a rectangle or HTML element.
    *
    * @param {Object} options
    *   - element: HTML element to zoom in on
    *   OR
    *   - x/y: coordinates in non-transformed space to zoom in on
    *   - width/height: the portion of the screen to zoom in on
    *   - scale: can be used instead of width/height to explicitly set scale
    */
    to: function( options ) {
      // Due to an implementation limitation we can't zoom in
      // to another element without zooming out first
      if( level !== 1 ) {
        zoom.out();
      }
      else {
        if(this.onZoom) {
          this.onZoom();
        }

        options.x = options.x || 0;
        options.y = options.y || 0;

        // If an element is set, that takes precedence
        if( !!options.element ) {
          // Space around the zoomed in element to leave on screen
          var padding = 20;
          var bounds = options.element.getBoundingClientRect();

          options.x = bounds.left - padding;
          options.y = bounds.top - padding;
          options.width = bounds.width + ( padding * 2 );
          options.height = bounds.height + ( padding * 2 );
        }

        // If width/height values are set, calculate scale from those values
        if( options.width !== undefined && options.height !== undefined ) {
          options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
        }

        if( options.scale > 1 ) {
          options.x *= options.scale;
          options.y *= options.scale;

          magnify( options, options.scale );

          if( options.pan !== false ) {

            // Wait with engaging panning as it may conflict with the
            // zoom transition
            panEngageTimeout = setTimeout( function() {
              panUpdateInterval = setInterval( pan, 1000 / 60 );
            }, 800 );

          }
        }
      }
    },

    /**
    * Resets the document zoom state to its default.
    */
    out: function() {
      clearTimeout( panEngageTimeout );
      clearInterval( panUpdateInterval );

      magnify( { x: 0, y: 0 }, 1 );

      level = 1;

      if(this.onZoomOut) {
        this.onZoomOut();
      }
    },

    // Alias
    magnify: function( options ) { this.to( options ) },
    reset: function() { this.out() },

    zoomLevel: function() {
      return level;
    }
  }

})();
