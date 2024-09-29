'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /score-rules page
	It is not bundled into the min file that is served on the first load of the page.
*/

define('forum/score-rules', function () {
	console.log('load score-rules:',ajaxify.data.uid);
	var ScoreRules = {};
	ScoreRules.init = function() {
		handlePrePage();
		handleNextPage();
		handleChangePageSize();
	};
	function handleChangePageSize(){
		const pageSize = parseInt($('#page-size').val());
		const currentPage = parseInt($('#current-page').html());
		const start = (currentPage - 1) * pageSize;
		const stop = start + pageSize - 1;
		$('#page-size').on('change', () => {
			const pageSize = parseInt($('#page-size').val());
			loadSearchPage({
				uid: ajaxify.data.uid,
				pageSize: pageSize,
				currentPage: 1,
			  });
		});
	}
	function handlePrePage(){
		// const records = await db.getSortedSetRevRange(userScoreKey(uid), start, stop);
		// const pageSize = parseInt($('#page-size').val());
		$('#pre-page').on('click', () => {
			const pageSize = parseInt($('#page-size').val());
			const currentPage = parseInt($('#current-page').html()) - 1;
			if(currentPage < 1){
				return;
			}
			loadSearchPage({
				uid: ajaxify.data.uid,
				pageSize: pageSize,
				currentPage: currentPage>=1?currentPage:1,
			  });
		});
	}
	function handleNextPage(){
		// const pageSize = parseInt($('#page-size').val());
		$('#next-page').on('click', () => {
			const pageSize = parseInt($('#page-size').val());
			const currentPage = parseInt($('#current-page').html()) + 1;
			const totalPages = parseInt($('#total-page').html());
			if(currentPage > totalPages){
				return;
			}
			loadSearchPage({
				uid: ajaxify.data.uid,
				pageSize: pageSize,
				currentPage: currentPage,
			  });
		});
	}
	function loadSearchPage(query) {
		const qs = decodeURIComponent($.param(query));
		$.get(config.relative_path + '/api/v3/plugins/scores/user?' + qs, function (data) {
			renderSearchResults(data);
		}).fail(function (xhrErr) {
			if (xhrErr && xhrErr.responseJSON && xhrErr.responseJSON.error) {
				alerts.error(xhrErr.responseJSON.error);
			}
		});
	}
	function renderSearchResults(data) {
	$('.fa-spinner').removeClass('hidden');
	app.parseAndTranslate('/score-rules', 'scores', data.response, function (html) {
		$('.scores-table tbody tr').remove();
		$('.scores-table tbody').append(html);
		$('#current-page').html(data.response.currentPage);
		$('#total-page').html(data.response.totalPage);
		$('.fa-spinner').addClass('hidden');
	});
	}
	return ScoreRules;
});
