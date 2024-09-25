'use strict';

$(document).ready(function () {
	/*
		This file shows how admin page client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "acpScripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/
/*
此文件显示了如何通过插件包含管理页面客户端 javascript。
如果您检查 `plugin.json`，您会看到此文件列在“acpScripts”下。
该数组告诉 NodeBB 将哪些文件捆绑到提供给最终用户的最小化 javascript 中。

您可以选择监听的一些事件：

$(document).ready(); 当 DOM 准备就绪时触发
$(window).on('action:ajaxify.end', function(data) { ... }); “data”包含“url”
*/
	console.log('nodebb-plugin-score-rules: acp-loaded');
	// Note how this is shown in the console on the first load of every page in the ACP
	// 请注意，在 ACP 中每个页面首次加载时，控制台中是如何显示的
});
