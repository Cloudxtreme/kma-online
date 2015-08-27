//enabled button: blue waves-effect waves-light 

$(document).ready(function (){
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 10, // Creates a dropdown of 15 years to control year
	  onClose: function() {
      $('#date').blur();
	  },
    onSet: function(context) {
      $('#op').focus();
      validateForm();
    }
  });
  
  $('#btn-add').click(addButtonClicked);
  
  if (!invoice)
    $('#file').on("change", file_OnChange);
  
  $('#op').blur(validateForm);
  $('#sv').blur(validateForm);
  $('#invoiceNum').blur(validateForm);
  
  if (invoice) {
    $('.datepicker').pickadate('picker').set('select', new Date(invoice.date));
    validateForm();
  }
});

$(document).ajaxError(function (event, xhr, settings, thrownError) {
  $('#message').html(xhr.responseText);
});


/*
 * When the add button is clicked this will call all of the
 * validator functions to make sure everything is good to go.
 * It will then submit the new or edited client.
 */
function addButtonClicked () {
  if (!validateForm()) return;
  
  var newInvoice = {
    _client: clientId,
    _project: project._id,
    date: new Date($('#date').val()),
    op: parseOP(),
    sv: parseSV(),
    invoiceNum: parseInt($('#invoiceNum').val())
  };
  
  if (!invoice) {
    newInvoice.laborSheet = $('#select-labor').val();
    newInvoice.itemsSheet = $('#select-items').val();
    newInvoice.wbPath     = $('#ws-panel').attr('path');
  }
  
  if (!invoice)
    $.post('/api/v1/invoices/', newInvoice, function (res) {
      console.log(res);
      window.location = "/app/clients/" + clientId + "/projects/" + project._id;
    });
  
  else {
    newInvoice._id = invoice._id;
    newInvoice.__v = invoice.__v;
    $.ajax({
      url: '/api/v1/invoices/',
      data: newInvoice,
      type: 'PUT',
      success: function (res) {
        window.location = "/app/clients/" + clientId + "/projects/" + project._id;
      }
    });
  }
}

/*
 * When the user selects a new file for the workbook, this handler
 * will be called. Loads the workbook and renders the sheet picker
 * jade file inline.
 */
function file_OnChange () {
  $('#ws-select').html("");

  var file = $(this).prop('files')[0];
  var formData = new FormData();
  formData.append('file', file);
  
  $.ajax({
    url: "/app/utils/ws-selector",
    type: "POST",
    data: formData,
    processData: false,
    cache: false,
    contentType: false,
    success: function (res) {
      $('#ws-select').html(res);
      $('select').material_select();
      $('#select-labor').change(laborSheetSelected);
      $('#select-items').change(itemSheetSelected);
    }
  });
}

function laborSheetSelected () {
  validateForm();
} 

function itemSheetSelected () {
  validateForm();
} 

/*
 * Validates that all fields have been entered and if so it will
 * activate the button
 */
function validateForm () {
  var sheetsValid = true;
  if (!invoice)
    sheetsValid = ($('#select-items').val() && $('#select-labor').val() &&
      $('#select-items').val() != $('#select-labor').val());
    
  var date = new Date($('#date').val());
  var dateValid = (Object.prototype.toString.call(date) === "[object Date]");
  var validOP = validateOP();
  var validSV = validateSV();
  var validInvoiceNum = validateInvoiceNum();
  
  // it is a date
    
  if (sheetsValid && dateValid && validOP && validSV && validInvoiceNum) {
    $('#btn-add').removeClass('disabled');
    $('#btn-add').addClass('blue waves-effect waves-light');
    return true;
  } else {
    $('#btn-add').addClass('disabled');
    $('#btn-add').removeClass('blue waves-effect waves-light');
    return false;
  }
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
  * Validates that the invoice num has a numerical value.
  */
 function validateInvoiceNum() {
   if ( !$('#invoiceNum').val()) {
     $('#invoiceNum').val("0");
     return false;
   }
   
   var val = parseInt($('#invoiceNum').val());
   if (!isNaN(val) && val > 0) {
     $('#invoiceNum').removeClass("invalid");
     $('#message').html('');
     return true;
   }
   else {
     $('#message').html('Invalid Invoice Number');
     $('#invoiceNum').addClass("invalid");
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