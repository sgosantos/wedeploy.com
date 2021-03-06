'use strict';

var marble = require('marble');

module.exports = {
	metalComponents: ['electric-marble-components'],
	sassOptions: {
		includePaths: ['node_modules', marble.src]
	},
	codeMirrorLanguages: ['xml', 'css', 'javascript', 'clike', 'swift', 'groovy'],
	vendorSrc: ['node_modules/marble/build/fonts/**']
};
