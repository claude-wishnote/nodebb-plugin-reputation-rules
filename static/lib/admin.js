'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /admin/plugins/score-rules page
	It is not bundled into the min file that is served on the first load of the page.
*/
/*
此文件位于 plugin.json 的“modules”块中
仅当用户导航到 /admin/plugins/score-rules 页面时才会加载
它不会捆绑到页面首次加载时提供的 min 文件中。
*/
import { save, load } from 'settings';
import * as uploader from 'uploader';

export function init() {
	handleSettingsForm();
	setupUploader();
};

function handleSettingsForm() {
	load('score-rules', $('.score-rules-settings'), function () {
		setupColorInputs();
	});

	$('#save').on('click', () => {
		save('score-rules', $('.score-rules-settings')); // pass in a function in the 3rd parameter to override the default success/failure handler
	});
}

function setupColorInputs() {
	var colorInputs = $('[data-settings="colorpicker"]');
	colorInputs.on('change', updateColors);
	updateColors();
}

function updateColors() {
	$('#preview').css({
		color: $('#color').val(),
		'background-color': $('#bgColor').val(),
	});
}

function setupUploader() {
	$('#content input[data-action="upload"]').each(function () {
		var uploadBtn = $(this);
		uploadBtn.on('click', function () {
			uploader.show({
				route: config.relative_path + '/api/admin/upload/file',
				params: {
					folder: 'score-rules',
				},
				accept: 'image/*',
			}, function (image) {
				$('#' + uploadBtn.attr('data-target')).val(image);
			});
		});
	});
}
