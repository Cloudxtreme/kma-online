$(document).ready(function () {
  $('#nav-clients').addClass("active");
  
  $('#search').keyup(function(e) {
    var s = $(this).val();
    
    $('.client-row').each(function () {
      var row = $(this);
      var clientName = $(row).attr('client').toLowerCase();
      
      if (clientName.indexOf(s) < 0)
        $(row).hide();
      else 
        $(row).show();
    });
  });
  
  $('#search').blur(function () {
    $(this).val("");
    $('.client-row').each(function () {
      $(this).show();
    });
  });
});

