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
  if (!validateOP()) return;
  if (!validateSV()) return;
  
  var newProject = {
    _client: clientId,
    name: $("#name").val(),
    location: $("#location").val(),
    op: parseOP(),
    sv: parseSV(),
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
        window.location = "/app/clients/" + clientId;
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

/*
 * Validates the Overhead and Profit input. Makes sure it's a proper
 * float within the range [0, 100].
 */
function validateOP () {
  if ( !$('#op').val() ) {
    $('#op').val("0.00%");
    return true;
  }
  
  var parsed = parseOP();
  if ( !isNaN(parsed) && parsed >= 0 && parsed <= 1 ) {
    
    $('#op').removeClass("invalid");
    $('#message').html('');
    return true;
    
  } else {
    
    $('#message').html("Invalid Overhead and Percentage");
    $('#op').addClass("invalid");
    return false;
    
  }
}

/*
 * Validates the default superivion cost input. Makes sure it's a proper
 * float.
 */
function validateSV () {
  if ( !$('#sv').val() ) {
    $('#sv').val("$0.00");
    return true;
  }
  
  var parsed = parseSV();
  if ( !isNaN(parsed) && parsed >= 0 ) {
    
    $('#sv').removeClass("invalid");
    $('#message').html('');
    return true;
    
  } else {
    
    $('#message').html("Invalid Supervision Cost");
    $('#sv').addClass("invalid");
    return false;
    
  }
}

/*
 * Removes commas and percentage signs and attempts to parse to a float.
 * Divides by 100 to get the percentage in decimal form.
 */
function parseOP () {
  var s = $('#op').val();
 
  s = s.replace(/,|\$|\%/g, "");
  
  var parsed = parseFloat(s);
  parsed = parsed / 100.0;
  
  return parsed;
}

/*
 * Removes commas and dollar signs and attempts to parse to a float.
 */
function parseSV () {
  var s = $('#sv').val();
 
  s = s.replace(/,|\$|\%/g, "");
  
  var parsed = parseFloat(s);
  
  return parsed;
}