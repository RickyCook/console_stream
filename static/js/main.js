$(document).ready(function() {
	var console_ = $('#console'),
	    command = $('#command'),
	    run = $('#run'),
	    host = document.location.hostname

	function command_output(part) {
		str = String.fromCharCode.apply(null, new Uint8Array(part))
		console_.append(str)
	}
	function send_command(command) {
		var connection = new WebSocket('ws://' + host + ':5001')
		connection.binaryType = "arraybuffer"
		connection.onopen = function() {
			connection.send(command)
			console_.text("$ " + command + "\n")
		}
		connection.onmessage = function(ev) {
			command_output(ev.data)
		}
		connection.onerror = function(err) { alert("Error: " + err) }
		connection.onclose = function() { alert("Done") }
	}
	run.click(function() {
		send_command(command.val())
	})
	console_.html("ready...")
})
