$(document).ready(function (){	
	$("#get-user").click(function () {
		console.log('Clicked Get User Button');
		$.get('/api/v1/user/1', function(res) {
			console.log('Res:', res);
			$("#json").text(res);
		});
	});
});