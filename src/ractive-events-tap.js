export default function tap ( node, fire ) {
	var mousedown, touchstart, focusHandler, distanceThreshold, timeThreshold, preventMousedownEvents, preventMousedownTimeout;

	distanceThreshold = 5; // maximum pixels pointer can move before cancel
	timeThreshold = 400;   // maximum milliseconds between down and up before cancel

	mousedown = function ( event ) {
		var currentTarget, x, y, pointerId, up, move, cancel;

		if ( preventMousedownEvents ) {
			return;
		}

		if ( event.which !== undefined && event.which !== 1 ) {
			return;
		}

		x = event.clientX;
		y = event.clientY;
		currentTarget = this;
		// This will be null for mouse events.
		pointerId = event.pointerId;

		up = function ( event ) {
			if ( event.pointerId != pointerId ) {
				return;
			}

			fire({
				node: currentTarget,
				original: event
			});

			cancel();
		};

		move = function ( event ) {
			if ( event.pointerId != pointerId ) {
				return;
			}

			if ( ( Math.abs( event.clientX - x ) >= distanceThreshold ) || ( Math.abs( event.clientY - y ) >= distanceThreshold ) ) {
				cancel();
			}
		};

		cancel = function () {
			node.removeEventListener( 'MSPointerUp', up, false );
			document.removeEventListener( 'MSPointerMove', move, false );
			document.removeEventListener( 'MSPointerCancel', cancel, false );
			node.removeEventListener( 'pointerup', up, false );
			document.removeEventListener( 'pointermove', move, false );
			document.removeEventListener( 'pointercancel', cancel, false );
			node.removeEventListener( 'click', up, false );
			document.removeEventListener( 'mousemove', move, false );
		};

		if ( window.navigator.pointerEnabled ) {
			node.addEventListener( 'pointerup', up, false );
			document.addEventListener( 'pointermove', move, false );
			document.addEventListener( 'pointercancel', cancel, false );
		} else if ( window.navigator.msPointerEnabled ) {
			node.addEventListener( 'MSPointerUp', up, false );
			document.addEventListener( 'MSPointerMove', move, false );
			document.addEventListener( 'MSPointerCancel', cancel, false );
		} else {
			node.addEventListener( 'click', up, false );
			document.addEventListener( 'mousemove', move, false );
		}

		setTimeout( cancel, timeThreshold );
	};

	if ( window.navigator.pointerEnabled ) {
		node.addEventListener( 'pointerdown', mousedown, false );
	} else if ( window.navigator.msPointerEnabled ) {
		node.addEventListener( 'MSPointerDown', mousedown, false );
	} else {
		node.addEventListener( 'mousedown', mousedown, false );
	}


	touchstart = function ( event ) {
		var currentTarget, x, y, touch, finger, move, up, cancel;

		if ( event.touches.length !== 1 ) {
			return;
		}

		touch = event.touches[0];

		x = touch.clientX;
		y = touch.clientY;
		currentTarget = this;

		finger = touch.identifier;

		up = function ( event ) {
			var touch;

			touch = event.changedTouches[0];
			if ( touch.identifier !== finger ) {
				cancel();
			}

			event.preventDefault();  // prevent compatibility mouse event

			// for the benefit of mobile Firefox and old Android browsers, we need this absurd hack.
			preventMousedownEvents = true;
			clearTimeout( preventMousedownTimeout );

			preventMousedownTimeout = setTimeout( function () {
				preventMousedownEvents = false;
			}, 400 );

			fire({
				node: currentTarget,
				original: event
			});

			cancel();
		};

		move = function ( event ) {
			var touch;

			if ( event.touches.length !== 1 || event.touches[0].identifier !== finger ) {
				cancel();
			}

			touch = event.touches[0];
			if ( ( Math.abs( touch.clientX - x ) >= distanceThreshold ) || ( Math.abs( touch.clientY - y ) >= distanceThreshold ) ) {
				cancel();
			}
		};

		cancel = function () {
			node.removeEventListener( 'touchend', up, false );
			window.removeEventListener( 'touchmove', move, false );
			window.removeEventListener( 'touchcancel', cancel, false );
		};

		node.addEventListener( 'touchend', up, false );
		window.addEventListener( 'touchmove', move, false );
		window.addEventListener( 'touchcancel', cancel, false );

		setTimeout( cancel, timeThreshold );
	};

	node.addEventListener( 'touchstart', touchstart, false );


	// native buttons, and <input type='button'> elements, should fire a tap event
	// when the space key is pressed
	if ( node.tagName === 'BUTTON' || node.type === 'button' ) {
		focusHandler = function () {
			var blurHandler, keydownHandler;

			keydownHandler = function ( event ) {
				if ( event.which === 32 ) { // space key
					fire({
						node: node,
						original: event
					});
				}
			};

			blurHandler = function () {
				node.removeEventListener( 'keydown', keydownHandler, false );
				node.removeEventListener( 'blur', blurHandler, false );
			};

			node.addEventListener( 'keydown', keydownHandler, false );
			node.addEventListener( 'blur', blurHandler, false );
		};

		node.addEventListener( 'focus', focusHandler, false );
	}


	return {
		teardown: function () {
			node.removeEventListener( 'pointerdown', mousedown, false );
			node.removeEventListener( 'MSPointerDown', mousedown, false );
			node.removeEventListener( 'mousedown', mousedown, false );
			node.removeEventListener( 'touchstart', touchstart, false );
			node.removeEventListener( 'focus', focusHandler, false );
		}
	};
}