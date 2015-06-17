$(document).ready(function () {
  $('select').material_select();
  
  $('#btn-add').click(addButtonClicked);
});

$(document).ajaxError(function (event, xhr, settings, thrownError) {
  $('#message').html("Unable to create client: " + xhr.responseText);
});

/*
 * When the add button is clicked this will call all of the
 * validator functions to make sure everything is good to go.
 */
function addButtonClicked () {
  if (!validateName()) return;
  if (!validatePhone()) return;
  if (!validateZip()) return;
  
  var newClient = {
    name: $("#name").val(),
    company: $("#company").val(),
    email: $("#email").val(),
    phone: parseInt($("#phone").val()),
    addr1: $("#addr1").val(),
    addr2: $("#addr2").val(),
    city: $("#city").val(),
    state: $("#state").val(),
    zip: parseInt($("#zip").val())
  };
  
  if (isNaN(newClient.phone))
    newClient.phone = 0;
  
  if (isNaN(newClient.zip))
    newClient.zip = 0;
  
  //console.log('newClient:', newClient);
  $.post('/api/v1/clients/', newClient, function (res) {
    console.log('redirecting');
    window.location = "/app/clients";
  });
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
function validatePhone () {
  var text = $('#phone').val(); 
  if (!text) return true;
  
  var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  if (text.match(phoneno))
  {
    $('#phone').removeClass("invalid");
    formatPhoneNumber();
    return true;
  } else {
    $('#message').html("Invalid phone number");
    $('#phone').addClass("invalid");
    return false;
  }
}

/*
 * Formats a phone number to be pure numbers
 */
function formatPhoneNumber() {
  var text = $('#phone').val(); 
  if (!text) return;
    
  var s2 = ("" + text).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  text = ((!m) ? null : m[1] + m[2] + m[3]);
  if (text) $('#phone').val(text);
}

/*
 * Makes sure the zip code is valid (5 digits)
 */
function validateZip () {
  var text = $('#zip').val();
  if (!text) return true;
  
  var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(text);
  
  if (isValidZip) {
    $('#zip').removeClass("invalid");
    return true;
  }
  
  $('#message').html("Invalid zip code");
  $('#zip').addClass("invalid");
  return false;
}