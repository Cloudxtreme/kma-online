$(document).ready(function () {
  $('#nav-clients').addClass("active");
  
  $('#search').keyup(function(e) {
    var s = $(this).val();
    
    $('.invoice-row').each(function () {
      var row = $(this);
      var invoiceName = $(row).attr('invoice').toLowerCase();
      
      if (invoiceName.indexOf(s) < 0)
        $(row).hide();
      else 
        $(row).show();
    });
  });
  
  $('#search').blur(function () {
    $(this).val("");
    $('.invoice-row').each(function () {
      $(this).show();
    });
  });
});

