$(document).ready(function () {
	//console.log(':)', invoice);
	$('#tab-overview' ).click(showOverviewPage);
    $('#tab-labor'    ).click(showLaborPage);
	$('#tab-items '   ).click(showItemsPage);
    $('#tab-add-items').click(showAddItemsPage);
	
	showOverviewPage();
});

function showOverviewPage () {
	$.get('/app/clients/' + clientId + '/projects/' + project._id + '/invoices/' + 
		invoice._id + '/overview', function (res) {
			$('#overview').html(res);
		});
}

function showItemsPage () {
	$.get('/app/clients/' + clientId + '/projects/' + project._id + '/invoices/' + 
		invoice._id + '/items', function (res) {
			$('#items').html(res);
		});
}

function showAddItemsPage () {
	$.get('/app/clients/' + clientId + '/projects/' + project._id + '/invoices/' + 
		invoice._id + '/additems', function (res) {
			$('#add-items').html(res);
	    });
}

function showLaborPage () {
	$.get('/app/clients/' + clientId + '/projects/' + project._id + '/invoices/' + 
		invoice._id + '/labor', function (res) {
			$('#labor').html(res);
	    });
}

/*
 * Removes commas and dollar signs and attempts to parse to a float.
 */
function parseRate (div) {
  var s = $(div).val();
 
  s = s.replace(/,|\$|\%/g, "");
  
  var parsed = parseFloat(s);
  
  return parsed;
}