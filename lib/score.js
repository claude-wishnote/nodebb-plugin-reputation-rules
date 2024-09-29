
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');
const user = require.main.require('./src/user');
// 全局分数记录的键
const scoreRecordKey = 'score-rules:users:score:records';
// 用户分数记录的键（函数）
const userScoreKey = uid => `score-rules:user:${uid}:score:records`;
// 用户总分数的键（函数）
const userTotalScoreKey = uid => `score-rules:user:${uid}:total:score`;

/**
 * 添加分数记录
 * @param {number} uid - 用户ID
 * @param {number} score - 分数变化
 * @param {string} action - 操作类型
 * @param {Object} context - 上下文信息
 * @returns {Object} 记录对象
 */
const addScoreRecord = async function (uid, score, action, context = {}) {
    const timestamp = Date.now();
    const record = {
        uid,
        score,
        timestamp,
        action,
        context
    };
    const value = JSON.stringify(record);

    // 添加到全局记录
    await db.sortedSetAdd(scoreRecordKey, timestamp, value);
    // 添加到用户个人记录
    await db.sortedSetAdd(userScoreKey(uid), timestamp, value);
    // 更新用户总分
    console.log(score)
    //总分不能小于0 getObjectField
    const currentTotalScore = await db.getObjectField(userTotalScoreKey(uid), 'score');
    if (currentTotalScore + score >= 0) {
      await db.incrObjectFieldBy(userTotalScoreKey(uid), 'score', score);
    } else {
      await db.setObjectField(userTotalScoreKey(uid), 'score', 0);
    }
    return record;
};

/**
 * 扣除分数
 * @param {number} uid - 用户ID
 * @param {number} score - 要扣除的分数
 * @param {string} action - 操作类型
 * @param {Object} context - 上下文信息
 * @returns {Object} 记录对象
 */
const deductScore = async function (uid, score, action, context = {}) {
	//分数不够返回错误
	if (await getUserTotalScore(uid) < score) {
		throw new Error('not enough scores');
	}
    return await addScoreRecord(uid, -1*score, action, context);
};

/**
 * 获取用户总分
 * @param {number} uid - 用户ID
 * @returns {number} 用户总分
 */
const getUserTotalScore = async function (uid) {
    return await db.getObjectField(userTotalScoreKey(uid), 'score') || 0;
};

/**
 * 获取全局分数记录
 * @param {number} start - 起始索引
 * @param {number} stop - 结束索引
 * @returns {Array} 记录数组
 */
const getGlobalScoreRecords = async function (start, stop) {
	console.log('getGlobalScoreRecords', start, '-',stop);
	let records = await db.getSortedSetRevRange(scoreRecordKey, start, stop);
	return Promise.all(records.map(async record => {
		const parsedRecord = JSON.parse(record);
		const userData = await user.getUserFields(parsedRecord.uid, ['username','email','picture']);
		parsedRecord.createTime = utils.toISOString(parsedRecord.timestamp);
		parsedRecord.username = userData.username;
		parsedRecord.email = userData.email;
		parsedRecord.picture = userData.picture;
 		return parsedRecord;
	}));
};

/**
 * 获取用户分数记录
 * @param {number} uid - 用户ID
 * @param {number} start - 起始索引
 * @param {number} stop - 结束索引
 * @returns {Array} 记录数组
 */
const getUserScoreRecords = async function (uid, start, stop) {
    const records = await db.getSortedSetRevRange(userScoreKey(uid), start, stop);
	return Promise.all(records.map(async record => {
		const parsedRecord = JSON.parse(record);
 		parsedRecord.createTime = utils.toISOString(parsedRecord.timestamp);
 		return parsedRecord;
	}));
};

/**
 * 删除用户所有分数记录
 * @param {number} uid - 用户ID
 */
const deleteUserScoreRecords = async function (uid) {
    const records = await db.getSortedSetRevRange(userScoreKey(uid), 0, -1);
    await db.sortedSetRemove(scoreRecordKey, records);
    await db.delete(userScoreKey(uid));
    await db.delete(userTotalScoreKey(uid));
};

const getUserScoreRecordsCount = async function (uid) {
	return await db.sortedSetCard(userScoreKey(uid));
};

const getGlobalScoreRecordsCount = async function () {
	return await db.sortedSetCard(scoreRecordKey);
};

module.exports = {
	addScoreRecord,
	getUserScoreRecords,
	deleteUserScoreRecords,
	getUserTotalScore,
	deductScore,
	getGlobalScoreRecords,
	getUserScoreRecordsCount,
	getGlobalScoreRecordsCount,
 }