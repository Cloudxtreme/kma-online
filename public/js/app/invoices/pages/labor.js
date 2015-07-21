var selectedLabor = null;

$(document).ready(function() {
    console.log('Loaded:', invoice);
    console.log('workers:', workers); 
   
    $('#labor-save-modal').click(saveLabor);
    $('#labor-delete-modal').click(deleteLabor);
    
    // $('.datepicker').pickadate({
    // selectMonths: true, // Creates a dropdown to control month
    // selectYears: 15 // Creates a dropdown of 15 years to control year
  // });
        
    
    $('.labor-link').click(function() {
        var laborId = $(this).attr('id');
        selectedLabor = $.grep(invoice.labor, function(e) { return e._id == laborId })[0];
        
        console.log(selectedLabor);
        $('#labor-worker').val(selectedLabor.worker._id);
        $('#labor-name').val(selectedLabor.name);
        $('#labor-rate').val("$" + selectedLabor.worker.billable);
        $('#labor-hours').val(selectedLabor.hours);
    });
    
    $('.labor-modal').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5,       // Opacity of modal background
        in_duration: 300,  // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() { 
            $('select').material_select();
            console.log('Ready');             
        },
        
        // What happens when the user closes the modal.
        complete: function() { 
            laborModalOnClose();
        } 
    });
});

function createLabor() {
    console.log('creating item...');
    
    selectedLabor = {
        _invoice: invoice._id,
        worker : $('#labor-worker').val(),
        name   : $('#labor-name').val(),
        hours  : parseRate('#labor-hours')
    };
    
    console.log('posting:', selectedLabor);
    
    $.ajax({
        url: '/api/v1/laborentries/',
        data: selectedLabor,
        type: 'POST',
        success: function (res) {
            console.log('Create:', res);
            
            $('#labor-modal').closeModal();
            laborModalOnClose();
            showLaborPage();
            // $('#cat_' + id).text(catText);
            // $('#cost_' + id).text(costText);
        }
    });
    
}


function saveLabor() {
    if (selectedLabor == null)
        return createLabor();
    
    console.log('saving...');

    selectedLabor.worker     = $('#labor-worker').val();
    selectedLabor.name       = $('#labor-name').val();
    selectedLabor.hours      = $('#labor-hours').val();
    
    $.ajax({
        url: '/api/v1/laborentries/',
        data: selectedLabor,
        type: 'PUT',
        success: function (res) {
            console.log('Update:', res);
            
            var worker = $.grep(workers, function(e){ return e._id == selectedLabor.worker; })[0];
            var id = selectedLabor._id;
            var costText = "$" + (worker.billable * selectedLabor.hours).toFixed(2);
            
            $('#laborworker_' + id).text(worker.name);
            $('#laborname_' + id).text(selectedLabor.name);
            $('#laborcost_' + id).text(costText);
            
            $('#labor-modal').closeModal();
            laborModalOnClose();
        }
    });
}

function deleteLabor() {
    console.log('clicked');
    if (!$("#labor-delete-modal").prop("confirm")) {
        $("#labor-delete-modal").prop("confirm", "confirm")
            .text("Really delete?")
            .addClass("waves-effect waves-red");
            
        return;
    }
    
    console.log('deleting...');
    
    $.ajax({
        url: '/api/v1/laborentries/' + selectedLabor._id,
        type: 'DELETE',
        success: function (res) {
            console.log("Delete:", res);
            
            $('#labor-modal').closeModal();
            laborModalOnClose();
            showLaborPage();
        }
    })
}

function laborModalOnClose() {
    selectedLabor = null;
            
    // Reset the delete button
    $("#labor-delete-modal").removeProp("confirm")
        .text("Delete")
        .removeClass("waves-effect waves-red");
        
    // Clear the modal inputs.
    $('#labor-worker').val("");
    $('#labor-name').val("");
    $('#labor-rate').val("");
    $('#labor-hours').val("");
        
    console.log('Done');
}