// ractive-events-tap tests
// ========================

(function () {

	var fixture = document.getElementById( 'qunit-fixture' );

	test( 'Mousedown followed by click results in a tap event', function ( t ) {
		var ractive, tapped;

		ractive = new Ractive({
			el: fixture,
			template: '<span id="test" on-tap="tap">tap me</span>',
			debug: true
		});

		ractive.on( 'tap', function () {
			tapped = true;
		});

		t.equal( tapped, undefined );
		simulant.fire( ractive.nodes.test, 'mousedown' );
		simulant.fire( ractive.nodes.test, 'click' );
		t.equal( tapped, true );
	});


	// TODO move this into Ractive-events-tap repo
	asyncTest( 'Pressing spacebar on a focused button results in a tap event', function ( t ) {
		var ractive, node, tapped;

		ractive = new Ractive({
			el: fixture,
			template: '<button id="test" on-tap="tap">tap me</button>'
		});

		node = ractive.nodes.test;

		ractive.on( 'tap', function ( event ) {
			tapped = true;
		});

		t.equal( tapped, undefined );

		simulant.fire( node, 'keydown', { which: 32 });
		t.equal( tapped, undefined );

		node.focus();
		t.equal( document.activeElement, node );
		simulant.fire( node, 'keydown', { which: 32 });

		setTimeout( function () {
			t.ok( tapped, 'was tapped' );
			start();
		}, 100 );
	});


}());
