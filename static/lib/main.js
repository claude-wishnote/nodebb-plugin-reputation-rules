'use strict';

/**
 * This file shows how client-side javascript can be included via a plugin.
 * If you check `plugin.json`, you'll see that this file is listed under "scripts".
 * That array tells NodeBB which files to bundle into the minified javascript
 * that is served to the end user.
 *
 * There are two (standard) ways to wait for when NodeBB is ready.
 * This one below executes when NodeBB reports it is ready...
 */
/**
* 此文件显示如何通过插件包含客户端 javascript。
* 如果您检查 `plugin.json`，您会看到此文件列在“脚本”下。
* 该数组告诉 NodeBB 将哪些文件捆绑到提供给最终用户的最小化 javascript 中。
*
* 有两种（标准）方法可以等待 NodeBB 准备就绪。
* 当 NodeBB 报告它已准备就绪时，下面的方法将执行...
*/
(async () => {
	const hooks = await app.require('hooks');
	hooks.on('action:ajaxify.end', (/* data */) => {
		// ...
	});
})();

/**
 * ... and this one reports when the DOM is loaded (but NodeBB might not be fully ready yet).
 * For most cases, you'll want the one above.
 */
/**
* ... 这个报告 DOM 何时加载（但 NodeBB 可能尚未完全准备好）。
* 大多数情况下，您需要上面的那个。
*/
$(document).ready(function () {
	// ...
});
