$(document).ready(function () {
  $('#nav-clients').addClass("active");
  
  $('#search').keyup(function(e) {
    var s = $(this).val();
    
    $('.project-row').each(function () {
      var row = $(this);
      var projectName = $(row).attr('project').toLowerCase();
      
      if (projectName.indexOf(s) < 0)
        $(row).hide();
      else 
        $(row).show();
    });
  });
  
  $('#search').blur(function () {
    $(this).val("");
    $('.project-row').each(function () {
      $(this).show();
    });
  });
});