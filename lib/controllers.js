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
	console.log(scores);
	res.render('admin/plugins/reputation-rules', {
		title: 'reputation-rules',
		scores: scores,
	});
};
