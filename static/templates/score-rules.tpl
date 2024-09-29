<div class="card card-body text-bg-light">
	<p>Your score is {totalScore}!</p>
	<p id="last-p"></p>
	<div class="table-responsive flex-grow-1">
		<table class="table scores-table text-sm">
			<thead>
				<tr>
					<th class="text-end">create time</th>
					<th class="text-end">action</th>
					<th class="text-end">score</th>
					<th class="text-end">data</th>
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
				<option value="10">10-per-page</option>
				<option value="20">20-per-page</option>
				<option value="50">50-per-page</option>
				<option value="100">100-per-page</option>
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