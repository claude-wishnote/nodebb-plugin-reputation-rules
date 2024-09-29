<div>
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="score-rules-settings">
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">	
					    Score Settings
					</h5>
					<div class="mb-3">
						<div>
						Topic Post Score Settings:
						</div>
						<label class="form-label" for="topicPostScore">Topic Post Score</label>
						<input type="number" id="topicPostScore" name="topicPostScore" title="TopicPostScore" class="form-control" placeholder="Topic Post Score">
					</div>
					<div class="mb-3">
						<div>
						Comment Post Score Settings:
						</div>
						<label class="form-label" for="commentPostScore">Comment Post Score</label>
						<input type="number" id="commentPostScore" name="commentPostScore" title="CommentPostScore" class="form-control" placeholder="Comment Post Score">
					</div>
					<div class="mb-3">
						<div>
						Upvoted Score Settings:
						</div>
						<label class="form-label" for="upvotedScore">Upvoted Score</label>
						<input type="number" id="upvotedScore" name="upvotedScore" title="upvotedScore" class="form-control" placeholder="Upvoted Score">
					</div>
				</div>
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">	
					  All Users Score History List
					</h5>
					<i class="fa fa-spinner fa-spin hidden"></i>
					<div class="table-responsive flex-grow-1">
						<table class="table scores-table text-sm">
							<thead>
								<tr>
									<th class="text-end text-muted">uid</th>
									<th class="text-end">username</th>
									<th class="text-end">email</th>
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
			</form>
		</div>
		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>
