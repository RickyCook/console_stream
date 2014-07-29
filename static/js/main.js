$(document).ready(function() {
	var console_ = $('#console'),
	    command = $('#command'),
	    run = $('#run')

	function send_command(command) {
		console_.text('$ ' + command + ' # not run')
	}
	run.click(function() {
		send_command(command.val())
	})
	console_.html('ready...')
})
