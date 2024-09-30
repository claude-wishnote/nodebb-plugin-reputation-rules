'use strict';

define('forum/score-rules', ['translator'], function (translator) {
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
            const newPageSize = parseInt($('#page-size').val());
            loadSearchPage({
                uid: ajaxify.data.uid,
                pageSize: newPageSize,
                currentPage: 1,
            });
        });
    }

    function handlePrePage(){
        $('#pre-page').on('click', () => {
            const pageSize = parseInt($('#page-size').val());
            const currentPage = parseInt($('#current-page').html()) - 1;
            if(currentPage < 1){
                return;
            }
            loadSearchPage({
                uid: ajaxify.data.uid,
                pageSize: pageSize,
                currentPage: Math.max(currentPage, 1),
            });
        });
    }

    function handleNextPage(){
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
                translator.translate('[[error:' + xhrErr.responseJSON.error + ']]', function(translated) {
                    alerts.error(translated);
                });
            }
        });
    }

    function renderSearchResults(data) {
        $('.fa-spinner').removeClass('hidden');
        app.parseAndTranslate('score-rules', 'scores', data.response, function (html) {
            $('.scores-table tbody tr').remove();
            $('.scores-table tbody').append(html);
            updatePagination(data.response);
            $('.fa-spinner').addClass('hidden');
        });
    }

    function updatePagination(data) {
        translator.translate('[[score-rules:current-page]]', function(translatedCurrentPage) {
            $('#current-page').html(data.currentPage);
        });
        translator.translate('[[score-rules:total-page]]', function(translatedTotalPage) {
            $('#total-page').html(data.totalPage);
        });
    }

    return ScoreRules;
});