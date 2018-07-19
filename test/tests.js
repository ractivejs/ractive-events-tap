describe( 'ractive-events-tap', function () {
	var fixture;

	beforeEach( function () {
		fixture = document.createElement( 'div' );
		document.body.appendChild( fixture );
	});

	afterEach( function () {
		document.body.removeChild( fixture );
	});

	it( 'Mousedown followed by click results in a tap event', function () {
		var ractive, tapped;

		ractive = new Ractive({
			el: fixture,
			template: '<span id="test" on-tap="tap">tap me</span>',
			debug: true
		});

		ractive.on( 'tap', function () {
			tapped = true;
		});

		assert.equal( tapped, undefined );
		simulant.fire( ractive.nodes.test, 'mousedown' );
		simulant.fire( ractive.nodes.test, 'click' );
		assert.equal( tapped, true );
	});

	it( 'Pressing spacebar on a focused button results in a tap event', function ( done ) {
		var ractive, node, tapped;

		ractive = new Ractive({
			el: fixture,
			template: '<button id="test" on-tap="tap">tap me</button>'
		});

		node = ractive.nodes.test;

		ractive.on( 'tap', function () {
			tapped = true;
		});

		assert.equal( tapped, undefined );

		simulant.fire( node, 'keydown', { which: 32 });
		assert.equal( tapped, undefined );

		node.focus();
		assert.equal( document.activeElement, node );
		simulant.fire( node, 'keydown', { which: 32 });

		setTimeout( function () {
			assert.ok( tapped, 'was tapped' );
			done();
		}, 100 );
	});

	it( 'IE Edge window.pointerEnabled == undefined should still result in a tap event', function ( done ) {
		var ractive, node, tapped;

		window.navigator.pointerEnabled = undefined;
		/** NOTE removed mocking PointerEvent, it should be handled in the Browser itself. Ex. Chrome 56+
		 * Because window.PointerEvent = new PointerEvent() is just very incorrect.
		 * window.PointerEvent = new PointerEvent("pointerdown", {}); */

		ractive = new Ractive({
			el: fixture,
			template: '<button id="test" on-tap="tap">tap me</button>',
			debug: true
		});

		node = ractive.nodes.test;

		ractive.on( 'tap', function () {
			tapped = true;
		});

		assert.equal( tapped, undefined );
		simulant.fire( node, 'mousedown' );
		simulant.fire( node, 'pointerdown' );
		simulant.fire( node, 'pointerup' );
		assert.equal( tapped, true );

		setTimeout( function () {
			assert.equal( tapped, true );
			done();
		}, 100 );
	});
});
