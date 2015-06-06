/* global $ */

/* JQuery handlers */
$(document).ready(function () {

  // $('login-form-input').click(function (){
  //   $('login-form-input').removeClass("login-form-input").addClass("login-form-input-selected").fade();
  // });
	
  $('#login-form').submit(function (event) {
	console.log('clicked');
    event.preventDefault(); 
	 
	var username = $('#username').val();
	var password = $('#password').val();
	 
	$.post( "login", { 
	    username: username, 
	    password: password 
	  }, function (res) {
	    console.log(res);
	  });
  });
});

/* Handle any errors returned from server */
$(document).ajaxError(function (event, request, settings) {
	
  $('#message').text(request.responseJSON.message);
  
});