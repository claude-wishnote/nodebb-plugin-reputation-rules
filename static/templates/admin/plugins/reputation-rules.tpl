<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="reputation-rules-settings">
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">	
					  Reputation Score Settings
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
			</form>
		</div>
		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>
