$(document).ready(function () {
  $('#btn-add').click(addButtonClicked);
});

$(document).ajaxError(function (event, xhr, settings, thrownError) {
  $('#message').html("Unable to create project: " + xhr.responseText);
});

/*
 * When the add button is clicked this will call all of the
 * validator functions to make sure everything is good to go.
 * It will then submit the new or edited client.
 */
function addButtonClicked () {
  if (!validateName()) return;
  if (!validateLocation()) return;
  
  var newProject = {
    _client: clientId,
    name: $("#name").val(),
    location: $("#location").val(),
    isActive: (project) ? project.isActive : true
  };
  
  if (!project)
    $.post('/api/v1/projects/', newProject, function (res) {
      window.location = "/app/clients/" + clientId + "/projects";
    });
  
  else {
    newProject._id = project._id;
    newProject.__v = project.__v;
    $.ajax({
      url: '/api/v1/projects/',
      data: newProject,
      type: 'PUT',
      success: function (res) {
        window.location = "/app/clients/" + clientId + "/projects";
      }
    });
  }
}

/*
 * Ensures there is at least some text in the name field.
 */
function validateName () {
  if ( !$('#name').val() ) {
    $('#message').html("Name is required");
    $('#name').addClass("invalid");
    return false;
  }
  
  $('#name').removeClass("invalid");
  return true;
}

/*
 * Validates the phone number. If there is no text then it returns true
 * otherwise it checks to make sure the text is actually a phone number.
 */
function validateLocation () {
  if ( !$('#location').val() ) {
    $('#message').html("Name is required");
    $('#location').addClass("invalid");
    return false;
  }
  
  $('#location').removeClass("invalid");
  return true;
}