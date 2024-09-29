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
import * as alerts from 'alerts';

app = window.app || {};

export function init() {
	// handleSettingsForm();
	// setupUploader();
	handlePrePage();
	handleNextPage();
	handleChangePageSize();
	handleSettingsForm();
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
		console.log('loaded form');
	});
	$('#save').on('click', () => {
		console.log('save clicked');
		save('score-rules', $('.score-rules-settings'),
		function (){
			alerts.success('Settings Saved');
		}); // pass in a function in the 3rd parameter to override the default success/failure handler
	});
}
