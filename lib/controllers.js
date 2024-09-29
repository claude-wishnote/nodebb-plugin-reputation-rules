'use strict';

const { addScoreRecord,
	getUserScoreRecords,
	deleteUserScoreRecords,
	getUserTotalScore,
	deductScore,
	getGlobalScoreRecords,
	getGlobalScoreRecordsCount,
	getUserScoreRecordsCount} = require('./score');

const Controllers = module.exports;

Controllers.renderAdminPage = async function (req, res/* , next */) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/
	//取出10个的scores 历史
	//start从1开始
	const currentPage = parseInt(1) ;
	const pageSize =parseInt(10);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize - 1;
	const total = await getGlobalScoreRecordsCount(req.uid);
	const totalPage = Math.ceil(total / pageSize);
	const scores = await getGlobalScoreRecords(start, end);
	console.log('scores',scores);
	res.render('admin/plugins/score-rules', {
		title: 'score-rules',
		scores: scores,
		totalPage: totalPage,
		currentPage: currentPage,
	});
};

Controllers.renderScoreRulesPage = async function (req, res) {
	console.log('req.uid',req.uid);
	const currentPage = parseInt(1) ;
	const pageSize =parseInt(10);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize - 1;
	const total = await getUserScoreRecordsCount(req.uid);
	const totalPage = Math.ceil(total / pageSize);
	const scores = await getGlobalScoreRecords(start, end);
	res.render('score-rules',
		{
			uid: req.uid,
			totalScore: totalScore,
			scores: scores,
			totalPage: totalPage,
			currentPage: currentPage,
		});
	// const scores = await getUserScoreRecords(0, 10);
}