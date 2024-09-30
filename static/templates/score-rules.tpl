<div class="card card-body text-bg-light">
	<p>[[score-rules:your-score-is, {totalScore}]]</p>
	<p id="last-p"></p>
	<div class="table-responsive flex-grow-1">
		<table class="table scores-table text-sm">
			<thead>
				<tr>
					<th class="text-end">[[score-rules:create-time]]</th>
					<th class="text-end">[[score-rules:action]]</th>
					<th class="text-end">[[score-rules:score]]</th>
					<th class="text-end">[[score-rules:data]]</th>
				</tr>
			</thead>
			<tbody>
				{{{ each scores }}}
				<tr class="user-row align-middle">
					<td class="text-end">{scores.createTime}</td>
					<td class="text-end">{scores.action}</td>
					<td class="text-end">{scores.score}</td>
					<td class="text-end">{stringify(scores.context)}</td>
				</tr>
				{{{ end }}}
			</tbody>
		</table>
	</div>
	<div class="d-flex justify-content-end">
		<div class="d-flex">
			<select id="page-size" class="form-select form-select-sm w-auto">
				<option value="10">[[score-rules:per-page, 10]]</option>
				<option value="20">[[score-rules:per-page, 20]]</option>
				<option value="50">[[score-rules:per-page, 50]]</option>
				<option value="100">[[score-rules:per-page, 100]]</option>
			</select>
			<button id="pre-page" class="btn btn-light btn-sm dropdown-toggle" type="button">
				<i class="fa fa-arrow-left"></i>
			</button>
			<button class="btn btn-light btn-sm dropdown-toggle border border-gray-900" type="button">
				<span id="current-page" class="text-primary">{{currentPage}}</span>/<span id="total-page" class="text-primary">{{totalPage}}</span>								
			</button>
			<button id="next-page" class="btn btn-light btn-sm dropdown-toggle" type="button">
				<i class="fa fa-arrow-right"></i>
			</button>
		</div>
	 </div>
</div>