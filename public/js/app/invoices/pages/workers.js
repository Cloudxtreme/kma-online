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
        billable : parseRate('#worker-billable'),
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
            // $('#cat_' + id).text(catText);
            // $('#cost_' + id).text(costText); //////// left off around here.
        }
    });
    
}


function saveWorker() {
    if (selectedWorker == null)
        return createWorker();
    
    console.log('saving...');

    selectedWorker.name     = $('#worker-name').val();
    selectedWorker.wage     = parseRate('#worker-wage');
    selectedWorker.billable = parseRate('#worker-billable');
    
    $.ajax({
        url: '/api/v1/laborentries/',
        data: selectedWorker,
        type: 'PUT',
        success: function (res) {
            console.log('Update:', res);
            
            var worker = $.grep(workers, function(e){ return e._id == selectedWorker.worker; })[0];
            var id = selectedWorker._id;
            var costText = "$" + (worker.billable * selectedWorker.hours).toFixed(2);
            
            $('#laborworker_' + id).text(worker.name);
            $('#laborname_' + id).text(selectedWorker.name);
            $('#laborcost_' + id).text(costText);
            
            $('#labor-modal').closeModal();
            workerModalOnClose();
        }
    });
}

function deleteWorker() {
    console.log('clicked');
    if (!$("#labor-delete-modal").prop("confirm")) {
        $("#labor-delete-modal").prop("confirm", "confirm")
            .text("Really delete?")
            .addClass("waves-effect waves-red");
            
        return;
    }
    
    console.log('deleting...');
    
    $.ajax({
        url: '/api/v1/laborentries/' + selectedWorker._id,
        type: 'DELETE',
        success: function (res) {
            console.log("Delete:", res);
            
            $('#labor-modal').closeModal();
            workerModalOnClose();
            showWorkerPage();
        }
    })
}

function workerModalOnClose() {
    selectedWorker = null;
            
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