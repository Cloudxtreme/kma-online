var path = require("path");
var cmd = require('child_process');
var Promise = require('bluebird');

var reports = {
  invoice: function (req, res) {
    var invoice = {
      text: 'hello world'
    };
    var outpath = './';
    
    return new Promise( function( resolve, reject ) {
      try {        
        console.log('dirname:', __dirname);
        var pl = cmd.spawn('perl', [ '-w', path.join(__dirname, 'invoice.pl'), outpath ] );
        
        pl.stderr.on('data', function( data ) { console.error( "stderr: ", data.toString() )});
        pl.stdout.on('data', function( data ) { console.error( "stdout: ", data.toString() )});
        
        pl.on('error', function( err ) {
          reject( err );
        });
        
        pl.stdin.end( JSON.stringify( invoice ) );
        
        pl.on('exit', function( code ) {
          console.log("close event");
          resolve( code );
        });
      }
      
      catch( err ) {
        reject( err );
      }
    })
    .then(function(data) {
      console.log('finished.', data);
      res.send(data);
    })
    .catch(function(err) {
      console.log('err:', err);
      res.send('error');
    });
  }
}

module.exports = reports;

exports.invoice = function( invoice, outfile )
{
    
};