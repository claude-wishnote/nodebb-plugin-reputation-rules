'use strict';

const { addScoreRecord,
	getUserScoreRecords,
	deleteUserScoreRecords,
	getUserTotalScore,
	deductScore,
	getGlobalScoreRecords } = require('./score');

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
	const scores = await getGlobalScoreRecords(0, 10);
	res.render('admin/plugins/score-rules', {
		title: 'score-rules',
		scores: scores,
	});
};

Controllers.renderScoreRulesPage = async function (req, res) {
	console.log('req.uid',req.uid);
	const scores = await getUserScoreRecords(req.uid, 0, 10);
	const totalScore = await getUserTotalScore(req.uid);
	res.render('score-rules',
		{
			uid: req.uid,
			totalScore: totalScore,
			scores: scores,
		});
	// const scores = await getUserScoreRecords(0, 10);
}