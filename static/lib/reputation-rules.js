'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /reputation-rules page
	It is not bundled into the min file that is served on the first load of the page.
*/

define('forum/reputation-rules', function () {
	var module = {};
	module.init = function () {
		$('#last-p').text('reputation-rules.js loaded!');
	};
	return module;
});
