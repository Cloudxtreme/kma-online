$(document).ready(function () {
	//console.log(':)', invoice);
	$('#tab-overview' ).click(showOverviewPage);
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