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
app = window.app || {};

export function init() {
	// handleSettingsForm();
	// setupUploader();
	handlePrePage();
	handleNextPage();
	handleChangePageSize();
};

async function handleChangePageSize(){
	$('#page-size').on('change', () => {
		const pageSize = parseInt($('#page-size').val());
		loadSearchPage({
			uid: ajaxify.data.uid,
			pageSize: pageSize,
			currentPage: 1,
		  });
	});
}
async function handlePrePage(){
	$('#pre-page').on('click', () => {
		const pageSize = parseInt($('#page-size').val());
		const currentPage = parseInt($('#current-page').html()) - 1;
		if(currentPage < 1){
			return;
		}
		loadSearchPage({
			pageSize: pageSize,
			currentPage: currentPage>=1?currentPage:1,
  		});
	});
}
async function handleNextPage(){
	$('#next-page').on('click', () => {
		const pageSize = parseInt($('#page-size').val());
		const currentPage = parseInt($('#current-page').html()) + 1;
		const totalPages = parseInt($('#total-page').html());
		if(currentPage > totalPages){
			return;
		}
		loadSearchPage({
			pageSize: pageSize,
			currentPage: currentPage,
  		});
	});
}
function loadSearchPage(query) {
	const qs = decodeURIComponent($.param(query));
	$.get(config.relative_path + '/api/v3/plugins/scores/admin?' + qs, function (data) {
		renderSearchResults(data);
	}).fail(function (xhrErr) {
		if (xhrErr && xhrErr.responseJSON && xhrErr.responseJSON.error) {
			alerts.error(xhrErr.responseJSON.error);
		}
	});
}

function renderSearchResults(data) {
	$('.fa-spinner').removeClass('hidden');
	app.parseAndTranslate('admin/plugins/score-rules', 'scores', data.response, function (html) {
		$('.scores-table tbody tr').remove();
		$('.scores-table tbody').append(html);
		$('#current-page').html(data.response.currentPage);
		$('#total-page').html(data.response.totalPage);
		$('.fa-spinner').addClass('hidden');
	});
}

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
