var selectedAddItem = null;

$(document).ready(function() {
    
    console.log('loaded');
    
    $('.item-row').click(function() {
        var itemId = $(this).attr('id');
        selectedAddItem = $.grep(invoice.addItems, function(e) { return e._id == itemId })[0];
        
        console.log(selectedAddItem);
        $('#category').val(selectedAddItem.category);
        $('#rate').val("$" + selectedAddItem.rate);
        $('#qty').val(selectedAddItem.qty);
    });
    
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() { 
            $('#add-item-save-modal').click(saveAddItem);
            $('#add-item-delete-modal').click(deleteAddItem);
            
            console.log('Ready');             
        },
        complete: function() { 
            selectedAddItem = null;
            console.log('Done');
        } // Callback for Modal close
    });
    
});

function createItem() {
    console.log('creating item...');
    
    selectedAddItem = {
        _invoice: invoice._id,
        category: $('#add-item-category').val(),
        rate:     parseRate("#add-item-rate"),
        qty:      $('#add-item-qty').val()
    };
    
    console.log('posting:', selectedAddItem);
    
    $.ajax({
        url: '/api/v1/itementries/',
        data: selectedAddItem,
        type: 'POST',
        success: function (res) {
            console.log('Create:', res);
            
            showAddItemsPage();
            // $('#cat_' + id).text(catText);
            // $('#cost_' + id).text(costText);
        }
    });
}

function saveAddItem() {
    if (selectedAddItem == null)
        return createItem();
    
    console.log('saving...');
    console.log('cat: ' + $('#category').val());
    selectedAddItem.category = $('#category').val();
    selectedAddItem.rate = parseRate();
    selectedAddItem.qty = $('#qty').val();
    
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
        }
    });
}

function deleteAddItem() {
    console.log('deleting...');
    
    
}