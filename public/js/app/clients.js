$(document).ready(function () {
  $('#nav-clients').addClass("active");
  
  $('#btn-add').click(addButtonClicked)
});

function addButtonClicked() {
  console.log('Button clicked!');
  
  var client = {
    name: "McKenna Prause",
    company: "Super Gardener",
    phone: 3608623677
  };
  
  $.post('/api/v1/clients', client, function(res) {
    console.log('res:', res);
  });
}

$(document).ajaxError(function (event, xhr, settings, thrownError) {
  //var err = JSON.parse(xhr.responseText);
  console.log('error:', xhr.responseText);
});