var gobble = require( 'gobble' );
var lib = require( '../gobblefile' );

gobble.cwd( __dirname );

module.exports = gobble([
	'src',
	'tests.js',
	lib
]);