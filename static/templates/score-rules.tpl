<div class="card card-body text-bg-light">
	<p>Your score is {totalScore}!</p>
	<p id="last-p"></p>
	<div class="table-responsive flex-grow-1">
		<table class="table users-table text-sm">
			<thead>
				<tr>
					<th class="text-end text-muted">uid</th>
					<th class="text-end">create time</th>
					<th class="text-end">action</th>
					<th class="text-end">score</th>
					<th class="text-end">data</th>
				</tr>
			</thead>
			<tbody>
				{{{ each scores }}}
				<tr class="user-row align-middle">
					<td class="text-end">{scores.uid}</td>
					<td class="text-end">{scores.createTime}</td>
					<td class="text-end">{scores.action}</td>
					<td class="text-end">{scores.score}</td>
					<td class="text-end">{stringify(scores.context)}</td>
				</tr>
				{{{ end }}}
			</tbody>
		</table>
	</div>
</div>