var selectedItem = null;

$(document).ready(function() {
    
    console.log('loaded');
    
    $('.item-row').click(function() {
        var itemId = $(this).attr('id');
        selectedItem = $.grep(invoice.addItems, function(e) { return e._id == itemId })[0];
        
        console.log(selectedItem);
        $('#category').val(selectedItem.category);
        $('#rate').val("$" + selectedItem.rate);
        $('#qty').val(selectedItem.qty);
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
            selectedItem = null;
            console.log('Done');
        } // Callback for Modal close
    });
    
});

function createItem() {
    console.log('creating item...');
    
    selectedItem = {
        _invoice: invoice._id,
        category: $('#category').val(),
        rate:     parseRate(),
        qty:      $('#qty').val()
    };
    
    $.ajax({
        url: '/api/v1/itementries/',
        data: selectedItem,
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
    if (selectedItem == null)
        return createItem();
    
    console.log('saving...');
    console.log('cat: ' + $('#category').val());
    selectedItem.category = $('#category').val();
    selectedItem.rate = parseRate();
    selectedItem.qty = $('#qty').val();
    
    var id = selectedItem._id;
    var catText = selectedItem.category;
    var costText = "$" + (selectedItem.rate * selectedItem.qty).toFixed(2);
    
    $.ajax({
        url: '/api/v1/itementries/',
        data: selectedItem,
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