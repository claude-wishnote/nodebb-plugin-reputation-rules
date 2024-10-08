'use strict';

const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const utils = require.main.require('./src/utils');
const controllers = require('./lib/controllers');
const rewards = require.main.require('./src/rewards');
const { addScoreRecord,
	deductScore,
	getGlobalScoreRecords,
	getUserScoreRecords,
	getUserScoreRecordsCount,
	getGlobalScoreRecordsCount} = require('./lib/score');
const routeHelpers = require.main.require('./src/routes/helpers');
const User = require.main.require('./src/user');

const plugin = {};

plugin.init = async (params) => {
    const { router /* , middleware , controllers */ } = params;
    routeHelpers.setupPageRoute(router, '/score-rules', [(req, res, next) => {
        winston.info(`[plugins/score-rules] In middleware. This argument can be either a single middleware or an array of middlewares`);
        setImmediate(next);
    }], controllers.renderScoreRulesPage);

    routeHelpers.setupAdminPageRoute(router, '/admin/plugins/score-rules', controllers.renderAdminPage);

		let topicPostScore = 5;
    await meta.settings.setOne('score-rules', 'topicPostScore', topicPostScore)
    //回复得分3
    let commentPostScore = 3;
    await meta.settings.setOne('score-rules', 'commentPostScore', commentPostScore)
     //他人点赞得分1
    let upvotedScore = 1;
    await meta.settings.setOne('score-rules', 'upvotedScore', upvotedScore)

};

plugin.addRoutes = async ({ router, middleware, helpers }) => {
		const adminMiddlewares = [
			middleware.admin.checkPrivileges,
			// use this to restrict the route to administrators
		];
    const loggedInmiddlewares = [
			// use this if you want only registered users to call this route
			middleware.ensureLoggedIn,
			// middleware.admin.checkPrivileges,
			// use this to restrict the route to administrators
		];
		routeHelpers.setupApiRoute(router, 'get', '/scores/admin', loggedInmiddlewares,async (req, res) => {
			const currentPage = parseInt(req.query.currentPage|| 1) ;
			const pageSize =parseInt(req.query.pageSize || 10);
			const start = (currentPage - 1) * pageSize;
			const end = start + pageSize - 1;
			const total = await getGlobalScoreRecordsCount();
			const totalPage = Math.ceil(total / pageSize);
			const scores = await getGlobalScoreRecords(start,end);
			helpers.formatApiResponse(200, res, {
				scores: scores,
				total: total,
				currentPage: currentPage,
				pageSize: pageSize,
				totalPage: totalPage,
			});
		});
    routeHelpers.setupApiRoute(router, 'get', '/scores/user', loggedInmiddlewares, async (req, res) => {
			const currentPage = parseInt(req.query.currentPage|| 1) ;
			const pageSize =parseInt(req.query.pageSize || 10);
			//start从1开始
			const start = (currentPage - 1) * pageSize;
			const end = start + pageSize - 1;
			const total = await getUserScoreRecordsCount(req.uid);
			const totalPage = Math.ceil(total / pageSize);
			const scores = await getUserScoreRecords(req.uid,start,end);
			helpers.formatApiResponse(200, res, {
					scores: scores,
					total: total,
					currentPage: currentPage,
					pageSize: pageSize,
					totalPage: totalPage,
			});
    });
		routeHelpers.setupApiRoute(router, 'post', '/scores/user/add', loggedInmiddlewares, async (req, res) => {
			const { score, action } = req.body;
			const response = await addScoreRecord(req.uid, score, action);
			helpers.formatApiResponse(200, res, response);
		});
		routeHelpers.setupApiRoute(router, 'post', '/scores/user/deduct', loggedInmiddlewares, async (req, res) => {
			const { score, action } = req.body;
			const response = await deductScore(req.uid, score, action);
			helpers.formatApiResponse(200, res, response);
		});
};

plugin.addNavigation = (data) => {
	// data.routes.push({
	// 	route: '/score-rules',
	// 	name: 'score-rules',
	// 	icon: 'fa-tint',
	// });
	return data;
}

plugin.addAdminNavigation = (header) => {
    header.plugins.push({
        route: '/plugins/score-rules',
        icon: 'fa-tint',
        name: 'score-rules',
    });

    return header;
};

// 定义操作类型
const actions = {
	createTopicPost: 'create topic post',  // 创建主题帖
	createCommentPost: 'create comment post',  // 创建评论帖
	upvotePost: 'upvote post',  // 点赞帖子
	unvotePost: 'unvote post',  // 取消点赞
	login: 'login',
};

/**
 * 处理用户点赞帖子的操作
 * @param {Object} data - 操作数据
 */
plugin.upvotePost = async (data) => {
	  winston.info("user:", data.uid, "upvotePost:", data.pid);
    const { upvotedScore } = await meta.settings.get('score-rules');
    await addScoreRecord(data.uid, upvotedScore, actions.upvotePost, { pid: data.pid });
};

/**
 * 处理用户取消点赞帖子的操作
 * @param {Object} data - 操作数据
 */
plugin.unvodePost = async (data) => {
	  winston.info("user:", data.uid, "unvodePost:", data.pid);
    const { upvotedScore } = await meta.settings.get('score-rules');
    await deductScore(data.uid, upvotedScore, actions.unvotePost, { pid: data.pid });
};

/**
 * 处理用户创建帖子的操作
 * @param {Object} data - 操作数据
 * @returns {Object} 更新后的数据
 */
plugin.createPost = async (data) => {
	  winston.info("user:", data.data.uid, "createPost:", data.data.pid);
    const { topicPostScore, commentPostScore } = await meta.settings.get('score-rules');
    if(data.data.isMain) {
        // 创建主题帖
        await addScoreRecord(data.data.uid, topicPostScore, actions.createTopicPost, {
            pid: data.data.pid,
            tid: data.data.tid,
            content: data.data.content
        });
    } else {
        // 创建评论帖
        await addScoreRecord(data.data.uid, commentPostScore, actions.createCommentPost, {
            pid: data.post.pid,
            tid: data.post.tid,
            content: data.post.content
        });
    }
    return data;
};


plugin.addRewardConditions =  (conditionsData) =>{
	conditionsData.push({
			name: 'Login Count',
			condition: 'custom/user.loginCount',
	});
 	return conditionsData;
};

plugin.onUserLogin = async (data) => {
	User.incrementUserFieldBy(data.uid, 'loginCount', 1, (err) => {
			if (err) {
				winston.error(`[plugins/custom-rewards] Error incrementing login count: ${err.message}`);
			} else {
				winston.info(`[custom-rewards] Incremented login count for user ${data.uid}`);
			}
	});

	await rewards.checkConditionAndRewardUser({
			uid: data.uid,
			condition: 'custom/user.loginCount',
			//返回loginCount的函数
			method: async () => {
				const loginCount = await User.getUserField(data.uid, 'loginCount');
				return loginCount;
			},
	});
// const websockets = require.main.require('./src/socket.io');
// websockets.in(`uid_${data.uid}`).emit('event:alert', { message: 'logined users can received!', title: 'socket alert message' });
	return data;
};

plugin.addReward =  (rewardData) => {
	rewardData.push({
    rid: 'custom/award-score',
    name: 'Award Score',
		inputs: [
			{
				type: 'text',
				name: 'score',
				label: 'Amount of score:'
			}
		]
	})
	return rewardData;
}

plugin.giveScoreRewards = async (data) => {
	const action = `reward:[${data.rewardData.condition}] ${data.rewardData.conditional} ${data.rewardData.value}`
	await addScoreRecord(data.uid, data.reward.score, action, { 'loginDate': utils.toISOString(Date.now()) });
}

module.exports = plugin;

//topic post
const mainPost = {
    post: {
      pid: 18,
      uid: 1,
      tid: 5,
      content: 'new topic new topic new topic new topic new topic new topic new topic new topic new topic',
      timestamp: 1727084257795
    },
    data: {
      uuid: '7b74db2a-33bb-4576-a77e-c88b2663f372',
      handle: '',
      title: 'new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic',
      content: 'new topic new topic new topic new topic new topic new topic new topic new topic new topic',
      thumb: '',
      cid: 2,
      tags: [],
      timestamp: 1727084257795,
      uid: 1,
      req: {
        uid: 1,
        params: {},
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/category/2/general-discussion',
        path: '/category/2/general-discussion',
        baseUrl: '/api/v3/topics',
        originalUrl: '/api/v3/topics',
        // headers: [Object]
      },
      fromQueue: false,
      tid: 5,
      ip: '127.0.0.1',
      isMain: true
    },
    caller: {
      uid: 1,
      req: {
        uid: 1,
        params: {},
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/category/2/general-discussion',
        path: '/category/2/general-discussion',
        baseUrl: '',
        originalUrl: '/api/v3/topics',
        // headers: [Object]
      }
    }
  }
//第二个直接回复
const secondPOST= {
    post: {
      pid: 19,
      uid: 1,
      tid: '5',
      content: '不是首个发言, 是第二个post',
      timestamp: 1727085164649
    },
    data: {
      tid: '5',
      content: '不是首个发言, 是第二个',
      uid: 1,
      req: {
        uid: 1,
        // params: [Object],
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic',
        baseUrl: '/api/v3/topics',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      },
      timestamp: 1727085164649,
      fromQueue: false,
      cid: 2,
      ip: '127.0.0.1'
    },
    caller: {
      uid: 1,
      req: {
        uid: 1,
        params: {},
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic',
        baseUrl: '',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      }
    }
  }
//第三个引用一个post
const quotePost ={
    post: {
      pid: 20,
      uid: 1,
      tid: '5',
      content: '@admin 在 [new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic](/post/19) 中说：\n' +
        '> 不是首个发言, 是第二个\n' +
        '\n' +
        '引用一个post',
      timestamp: 1727086565293,
      toPid: '19'
    },
    data: {
      uuid: 'cb4dc816-8043-4297-a7e0-e87b4b513e8c',
      tid: '5',
      handle: '',
      content: '@admin 在 [new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic new topic](/post/19) 中说：\n' +
        '> 不是首个发言, 是第二个\n' +
        '\n' +
        '引用一个post',
      toPid: '19',
      uid: 1,
      req: {
        uid: 1,
        // params: [Object],
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/2',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/2',
        baseUrl: '/api/v3/topics',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      },
      timestamp: 1727086565293,
      fromQueue: false,
      cid: 2,
      ip: '127.0.0.1'
    },
    caller: {
      uid: 1,
      req: {
        uid: 1,
        params: {},
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/2',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/2',
        baseUrl: '',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      }
    }
  }
//回复某个post
const replyPost = {
    post: {
      pid: 21,
      uid: 1,
      tid: '5',
      content: '@admin\n回复某个post,回复某个post,回复某个post',
      timestamp: 1727086793920,
      toPid: '20'
    },
    data: {
      uuid: '5cd52be9-1db8-4906-b638-a2adb02ed5a0',
      tid: '5',
      handle: '',
      content: '@admin\n回复某个post,回复某个post,回复某个post',
      toPid: '20',
      uid: 1,
      req: {
        uid: 1,
        // params: [Object],
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/3',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/3',
        baseUrl: '/api/v3/topics',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      },
      timestamp: 1727086793920,
      fromQueue: false,
      cid: 2,
      ip: '127.0.0.1'
    },
    caller: {
      uid: 1,
      req: {
        uid: 1,
        params: {},
        method: 'POST',
        // body: [Object],
        // session: [Session],
        ip: '127.0.0.1',
        host: 'localhost:4567',
        protocol: 'http',
        secure: false,
        url: 'http://localhost:4567/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/3',
        path: '/topic/5/new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic-new-topic/3',
        baseUrl: '',
        originalUrl: '/api/v3/topics/5',
        // headers: [Object]
      }
    }
  }