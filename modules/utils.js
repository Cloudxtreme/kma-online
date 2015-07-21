module.exports = {
    formatMoney: function(num) {
        return "$" + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
}