var selectedItem = null;

$(document).ready(function() {
    
    $('.modal-trigger').click(function() {
        var itemId = $(this).attr('id');
        selectedItem = $.grep(invoice.items, function(e) { return e._id == itemId })[0];
        
        console.log(selectedItem);
        $('#category').val(selectedItem.category);
        $('#subcat').val(selectedItem.subcat);
        $('#source').val(selectedItem.source);
        $('#memo').val(selectedItem.memo);
        $('#rate').val("$" + selectedItem.rate);
        $('#qty').val(selectedItem.qty);
    });
    
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() { 
            $('#save-modal').click(saveItem);
            $('#delete-modal').click(deleteItem);
            
            console.log('Ready');             
        },
        complete: function() { 
            selectedItem = null;
            console.log('Done');
        } // Callback for Modal close
    });
    
});

function saveItem() {
    console.log('saving...');
    console.log('cat: ' + $('#category').val());
    selectedItem.category = $('#category').val();
    selectedItem.subcat = $('#subcat').val();
    selectedItem.source = $('#source').val();
    selectedItem.memo = $('#memo').val();
    selectedItem.rate = parseRate();
    selectedItem.qty = $('#qty').val();
    
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
        }
    });
}

function deleteItem() {
    console.log('deleting...');
    
    
}

/*
 * Removes commas and dollar signs and attempts to parse to a float.
 */
function parseRate () {
  var s = $('#rate').val();
 
  s = s.replace(/,|\$|\%/g, "");
  
  var parsed = parseFloat(s);
  
  return parsed;
}