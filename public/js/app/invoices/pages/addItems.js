var selectedAddItem = null;

$(document).ready(function() {
    
    console.log('loaded');
    
    // Add the handlers for the save and delete modal buttons.
    $('#add-item-save-modal').click(saveAddItem);
    $('#add-item-delete-modal').click(deleteAddItem);
    
    // This gets called before the modal loads.
    $('.add-item-link').click(function() {
        // Grab the clicked addition item object.
        var itemId = $(this).attr('id');
        selectedAddItem = $.grep(invoice.addItems, function(e) { return e._id == itemId })[0];
        
        // Put the additional item info into the modal.
        console.log("add-item: " + selectedAddItem);
        $('#add-item-category').val(selectedAddItem.category);
        $('#add-item-rate').val("$" + selectedAddItem.rate.toFixed(2));
        $('#add-item-qty').val(selectedAddItem.qty);
    });
    
    $('.add-item-modal').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5,       // Opacity of modal background
        in_duration: 300,  // Transition in duration
        out_duration: 200, // Transition out duration
        
        // What to do when the modal opens.
        ready: function() { 
            console.log('Ready');             
        },
        
        // What happens when the modal closes.
        complete: addItemModalOnClose
    });
    
});

function createAddItem() {
    console.log('creating item...');
    
    selectedAddItem = {
        _invoice: invoice._id,
        category: $('#add-item-category').val(),
        rate:     parseRate("#add-item-rate"),
        qty:      $('#add-item-qty').val()
    };
    
    console.log('posting:', selectedAddItem);
    
    $.ajax({
        url: '/api/v1/itementries/additems',
        data: selectedAddItem,
        type: 'POST',
        success: function (res) {
            console.log('Create:', res);
            
            $('#add-items-modal').closeModal();
            addItemModalOnClose();
            showAddItemsPage();
            // $('#cat_' + id).text(catText);
            // $('#cost_' + id).text(costText);
        }
    });
    
}

function saveAddItem() {
    if (selectedAddItem == null)
        return createAddItem();
    
    console.log('saving...');
    console.log('cat: ' + $('#add-item-category').val());
    selectedAddItem.category = $('#add-item-category').val();
    selectedAddItem.rate = parseRate("#add-item-rate");
    selectedAddItem.qty = $('#add-item-qty').val();
    
    var id = selectedAddItem._id;
    var catText = selectedAddItem.category;
    var costText = "$" + (selectedAddItem.rate * selectedAddItem.qty).toFixed(2);
    
    $.ajax({
        url: '/api/v1/itementries/',
        data: selectedAddItem,
        type: 'PUT',
        success: function (res) {
            console.log('Update:', res);
            
            $('#cat_' + id).text(catText);
            $('#cost_' + id).text(costText);
            
            $('#add-items-modal').closeModal();
            addItemModalOnClose();
        }
    });
}

function deleteAddItem() {
    if (!$("#add-item-delete-modal").prop("confirm")) {
        $("#add-item-delete-modal").prop("confirm", "confirm")
            .text("Really delete?")
            .addClass("waves-effect waves-red");
            
        return;
    }
    
    console.log('deleting...');
    
    $.ajax({
        url: '/api/v1/itementries/' + selectedAddItem._id,
        type: 'DELETE',
        success: function (res) {
            console.log("Delete:", res);
            
            $('#add-items-modal').closeModal();
            addItemModalOnClose();
            showAddItemsPage();
        }
    })
}

function addItemModalOnClose() {
    selectedAddItem = null;
            
    // Reset the delete button
    $("#add-item-delete-modal").removeProp("confirm")
        .text("Delete")
        .removeClass("waves-effect waves-red");
        
    // Clear the modal inputs.
    $('#add-item-category').val("");
    $('#add-item-rate').val("");
    $('#add-item-qty').val("");
        
    console.log('Done');
}