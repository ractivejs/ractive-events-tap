import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/ractive-events-tap.js',
	plugins: [ buble() ],
	moduleName: 'Ractive.events.tap',
	targets: [
		{ dest: 'dist/ractive-events-tap.es.js', format: 'es' },
		{ dest: 'dist/ractive-events-tap.umd.js', format: 'umd' }
	]
};
