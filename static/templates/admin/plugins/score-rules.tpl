<div>
	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<form role="form" class="score-rules-settings border p-4 ">
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">	
					    [[score-rules:score-settings]]
					</h5>
					<div class="mb-3">
						<div>
						[[score-rules:topic-post-score]]:
						</div>
						<label class="form-label">[[score-rules:topic-post-score]]</label>
						<input type="number" id="topicPostScore" name="topicPostScore"  title="TopicPostScore" class="form-control" placeholder="[[score-rules:topic-post-score]]">
					</div>
					<div class="mb-3">
						<div>
						[[score-rules:comment-post-score]]:
						</div>
						<label class="form-label">[[score-rules:comment-post-score]]</label>
						<input type="number" id="commentPostScore" name="commentPostScore" title="CommentPostScore" class="form-control" placeholder="[[score-rules:comment-post-score]]">
					</div>
					<div class="mb-3">
						<div>
						[[score-rules:upvoted-score]]:
						</div>
						<label class="form-label">[[score-rules:upvoted-score]]</label>
						<input type="number" id="upvotedScore" name="upvotedScore"  title="upvotedScore" class="form-control" placeholder="[[score-rules:upvoted-score]]">
					</div>
				</div>
				<button id="save" class="btn btn-primary" type="submit">[[score-rules:save]]</button>
			</form>
			<div class="mt-4 mb-4">
				<h5 class="fw-bold tracking-tight settings-header">	
				  [[score-rules:all-users-score-history-list]]
				</h5>
				<i class="fa fa-spinner fa-spin hidden"></i>
				<div class="table-responsive flex-grow-1">
					<table class="table scores-table text-sm">
						<thead>
							<tr>
								<th class="text-end text-muted">[[score-rules:uid]]</th>
								<th class="text-end">[[score-rules:username]]</th>
								<th class="text-end">[[score-rules:email]]</th>
								<th class="text-end">[[score-rules:create-time]]</th>
								<th class="text-end">[[score-rules:action]]</th>
								<th class="text-end">[[score-rules:score]]</th>
								<th class="text-end">[[score-rules:data]]</th>
							 </tr>
						</thead>
						<tbody>
							{{{ each scores }}}
							<tr class="user-row align-middle">
								<td class="text-end">{scores.uid}</td>
								<td class="text-end">{scores.username}</td>
								<td class="text-end">{scores.email}</td>
								<td class="text-end">{scores.createTime}</td>
								<td class="text-end">{scores.action}</td>
								<td class="text-end">{scores.score}</td> 
								<td class="text-end">{stringify(scores.context)}</td> 
							</tr>
							{{{ end }}}
						</tbody>
					</table>
				</div>
				<div class="float-end">
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
		</div>
	</div>
</div>