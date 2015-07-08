var selectedItem = null;

$(document).ready(function() {
    
    $('#item-save-modal').click(saveItem);
    $('#item-delete-modal').click(deleteItem);
    
    $('.item-link').click(function() {
        var itemId = $(this).attr('id');
        selectedItem = $.grep(invoice.items, function(e) { return e._id == itemId })[0];
        
        console.log(selectedItem);
        $('#item-category').val(selectedItem.category);
        $('#item-subcat').val(selectedItem.subcat);
        $('#item-source').val(selectedItem.source);
        $('#item-memo').val(selectedItem.memo);
        $('#item-rate').val("$" + selectedItem.rate);
        $('#item-qty').val(selectedItem.qty);
    });
    
    $('.item-modal').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5,       // Opacity of modal background
        in_duration: 300,  // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() { 
            console.log('Ready');             
        },
        
        // What happens when the user closes the modal.
        complete: function() { 
            itemModalOnClose();
        } 
    });
    
});

function createItem() {
    console.log('creating item...');
    
    selectedItem = {
        _invoice: invoice._id,
        category: $('#item-category').val(),
        subcat  : $('#item-subcat').val(),
        source  : $('#item-source').val(),
        memo    : $('#item-memo').val(),
        rate    : parseRate("#item-rate"),
        qty     : $('#item-qty').val()
    };
    
    console.log('posting:', selectedItem);
    
    $.ajax({
        url: '/api/v1/itementries/items',
        data: selectedItem,
        type: 'POST',
        success: function (res) {
            console.log('Create:', res);
            
            $('#item-modal').closeModal();
            itemModalOnClose();
            showItemsPage();
            // $('#cat_' + id).text(catText);
            // $('#cost_' + id).text(costText);
        }
    });
    
}


function saveItem() {
    console.log('here');
    if (selectedItem == null)
        return createItem();
    
    console.log('saving...');

    selectedItem.category   = $('#item-category').val();
    selectedItem.subcat     = $('#item-subcat').val();
    selectedItem.source     = $('#item-source').val();
    selectedItem.memo       = $('#item-memo').val();
    selectedItem.rate       = parseRate("#item-rate");
    selectedItem.qty        = $('#item-qty').val();
    
    var id = selectedItem._id;
    var memoText = selectedItem.memo || selectedItem.category;
    var costText = "$" + (selectedItem.rate * selectedItem.qty).toFixed(2);
    
    $.ajax({
        url: '/api/v1/itementries/',
        data: selectedItem,
        type: 'PUT',
        success: function (res) {
            console.log('Update:', res);
            
            $('#memo_' + id).text(memoText);
            $('#cost_' + id).text(costText);
            
            $('#item-modal').closeModal();
            itemModalOnClose();
        }
    });
}

function deleteItem() {
    if (!$("#item-delete-modal").prop("confirm")) {
        $("#item-delete-modal").prop("confirm", "confirm")
            .text("Really delete?")
            .addClass("waves-effect waves-red");
            
        return;
    }
    
    console.log('deleting...');
    
    $.ajax({
        url: '/api/v1/itementries/' + selectedItem._id,
        type: 'DELETE',
        success: function (res) {
            console.log("Delete:", res);
            
            $('#item-modal').closeModal();
            itemModalOnClose();
            showItemsPage();
        }
    })
}

function itemModalOnClose() {
    selectedItem = null;
            
    // Reset the delete button
    $("#item-delete-modal").removeProp("confirm")
        .text("Delete")
        .removeClass("waves-effect waves-red");
        
    // Clear the modal inputs.
    $('#item-category').val("");
    $('#item-subcat').val("");
    $('#item-source').val("");
    $('#item-memo').val("");
    $('#item-rate').val("");
    $('#item-qty').val("");
        
    console.log('Done');
}