var selectedWorker = null;

$(document).ready(function() {
    console.log('workers:', workers); 
   
    $('#worker-save-modal').click(saveWorker);
    $('#worker-delete-modal').click(deleteWorker);
    
    $('.worker-link').click(function() {
        var workerId = $(this).attr('id');
        selectedWorker = $.grep(workers, function(e) { return e._id == workerId })[0];
        
        console.log(selectedWorker);
        $('#worker-name').val(selectedWorker.name);
        $('#worker-wage').val("$" + selectedWorker.wage);
        $('#worker-rate').val("$" + selectedWorker.billable);
    });
    
    $('.worker-modal').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5,       // Opacity of modal background
        in_duration: 300,  // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() { 
            console.log('Ready');             
        },
        
        // What happens when the user closes the modal.
        complete: function() { 
            workerModalOnClose();
        } 
    });
});

function createWorker() {
    console.log('creating worker...');
    
    selectedWorker = {
        _project : projectId,
        name     : $('#worker-name').val(),
        wage     : parseRate('#worker-wage'),
        billable : parseRate('#worker-rate'),
    };
    
    console.log('posting:', selectedWorker);
    
    $.ajax({
        url: '/api/v1/workers/',
        data: selectedWorker,
        type: 'POST',
        success: function (res) {
            console.log('Create:', res);
            
            $('#worker-modal').closeModal();
            workerModalOnClose();
            showWorkerPage();
        }
    });
    
}

function saveWorker() {
    if (selectedWorker == null)
        return createWorker();
    
    console.log('saving...');

    selectedWorker.name     = $('#worker-name').val();
    selectedWorker.wage     = parseRate('#worker-wage');
    selectedWorker.billable = parseRate('#worker-rate');
    
    $.ajax({
        url: '/api/v1/workers/',
        data: selectedWorker,
        type: 'PUT',
        success: function (res) {
            console.log('Update:', res);
            
            var id = selectedWorker._id;
            var wageText = "$" + selectedWorker.wage.toFixed(2);
            var billableText = "$" + selectedWorker.billable.toFixed(2);
            
            $('#workername_' + id).text(selectedWorker.name);
            $('#workerwage_' + id).text(wageText);
            $('#workerrate_' + id).text(billableText);
            
            $('#worker-modal').closeModal();
            workerModalOnClose();
        }
    });
}

function deleteWorker() {
    console.log('clicked');
    if (!$("#worker-delete-modal").prop("confirm")) {
        $("#worker-delete-modal").prop("confirm", "confirm")
            .text("Really delete?")
            .addClass("waves-effect waves-red");
            
        return;
    }
    
    console.log('deleting...');
    
    $.ajax({
        url: '/api/v1/workers/' + selectedWorker._id,
        type: 'DELETE',
        success: function (res) {
            console.log("Delete:", res);
            
            $('#worker-modal').closeModal();
            workerModalOnClose();
            showWorkerPage();
        }
    })
}

function workerModalOnClose() {
    selectedWorker = null;
            
    // Reset the delete button
    $("#worker-delete-modal").removeProp("confirm")
        .text("Delete")
        .removeClass("waves-effect waves-red");
        
    // Clear the modal inputs.
    $('#worker-name').val("");
    $('#worker-wage').val("");
    $('#worker-rate').val("");
        
    console.log('Done');
}