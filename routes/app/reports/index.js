var path = require("path");
var cmd = require('child_process');
var Promise = require('bluebird');
var Models  = require('../../../models')

var reports = {
  invoice: function (req, res) {
    var clientId  = req.params.clientId;
		var projectId = req.params.projectId;
		var id        = req.params.id;
    var client, project, invoice;
    
    var outpath = 'file.xls';
    
    Promise.resolve(Models.Client.findOne({ _id: clientId }).exec())
    .then(function (dbClient) {
      if (dbClient == null)
        throw new Error("Unable to retrieve client!");
      client = dbClient;
      return Promise.resolve(Models.Project.findOne({ _id: projectId }).exec());
    })
    .then(function (dbProject) {
      if (dbProject == null)
        throw new Error("Unable to retrieve project!");
      project = dbProject;
      return Promise.resolve(Models.Invoice.findOne({ _id: id})
      .populate({ path: 'labor', options: { sort: { 'worker'  : 1 } } })
		  .populate({ path: 'items', options: { sort: { 'category': 1 } } })
      .populate({ path: 'addItems', options: { sort: { 'category': 1 } } })
			.exec()
      .then(function (dbInvoice) {
        var options = {
            path: 'labor.worker',
            model: 'Worker'
        };
        
        // Populate workers.
        return Promise.resolve(Models.Invoice
            .populate(dbInvoice, options));
			}));
    })
    .then(function (dbInvoice) {
      if (dbInvoice == null)
        throw new Error("Unable to retrieve invoice!");
      invoice = dbInvoice;
      
      var items = [];
      
      console.log("LABOR:", invoice.labor);
      
      var laborCost = 0.0;
      
      for (var i = 0; i < invoice.labor.length; i++) {
        laborCost += invoice.labor[i].worker.billable * invoice.labor[i].hours; 
        items.push({
          name: invoice.labor[i].name,
          desc: "Labor",
          cost: invoice.labor[i].worker.billable * invoice.labor[i].hours
        });
      }
      
      var itemsCost = 0.0;
      
      for (var i = 0; i < invoice.items.length; i++) {
        itemsCost += invoice.items[i].rate * invoice.items[i].qty; 
        items.push({
          name: invoice.items[i].subcat || invoice.items[i].category,
          desc: invoice.items[i].memo,
          cost: invoice.items[i].rate * invoice.items[i].qty
        });
      }
      
      var addItemsCost = 0.0;
      
      for (var i = 0; i < invoice.addItems.length; i++) {
        addItemsCost += invoice.addItems[i].rate * invoice.addItems[i].qty; 
        items.push({
          name: invoice.addItems[i].subcat || invoice.addItems[i].category,
          desc: invoice.addItems[i].memo,
          cost: invoice.addItems[i].rate * invoice.addItems[i].qty
        });
      }
      
      items.push({
        name: "Supervision",
        desc: "Superintendent Labor for job site",
        cost: invoice.sv
      });
      
      console.log(invoice.sv);
      console.log(laborCost);
      console.log(itemsCost);
      console.log((invoice.sv + laborCost + itemsCost + addItemsCost) * invoice.op);
      
      items.push({
        name: "Contractor Fee",
        desc: "Company Fee for services rendered",
        cost: parseFloat(((invoice.sv + laborCost + itemsCost + addItemsCost) * invoice.op).toFixed(2))
      });
      
      console.log(items);
      
      var invoice_data = {
        client: {
          name: client.name,
          company: client.company,
          addr1: client.addr1,
          addr2: client.addr2,
          cityState: client.city + ", " + client.state + " " + client.zip
        },
        
        project: project.name,
        
        date: invoice.getDateString(),
        
        invoiceNum: invoice.invoiceNum,
        
        items: items,
        // items: [
        //   {
        //     name: "Item 2",
        //     desc: "An item used for building stuff.",
        //     cost: 45.67
        //   },
        //   {
        //     name: "Item 1",
        //     desc: "Another item used for building stuff.",
        //     cost: 12.34
        //   }
        // ],
        
        terms: "Due upon receipt",
        
        footer: "Past due accounts of 30 days will be " 
            + "billed a finance charge of 21% APR, 1.75% Monthly rate, "
            + "or .058% Daily rate"
      }
      
      return new Promise( function( resolve, reject ) {
        try {        
          console.log('dirname:', __dirname);
          var pl = cmd.spawn('perl', [ '-w', path.join(__dirname, 'invoice.pl'), outpath ], {cwd:__dirname} );
          
          pl.stderr.on('data', function( data ) { console.error( "stderr: ", data.toString() )});
          pl.stdout.on('data', function( data ) { console.error( "stdout: ", data.toString() )});
          
          pl.on('error', function( err ) {
            reject( err );
          });
          
          pl.stdin.end( JSON.stringify( invoice_data ) );
          
          pl.on('exit', function( code ) {
            console.log("close event");
            resolve( code );
          });
        }
        
        catch( err ) {
          reject( err );
        }
      })
    })
    .then(function(data) {
      console.log('finished.', data);
      res.download(path.join(__dirname, outpath));
    })
    .catch(function(err) {
      console.log('err:', err);
      res.send('error');
    });
    
    // var date = new Date();
    // var invoice = {
    //   client: {
    //     name: "Leslie Howa",
    //     addr1: "60 East Lane Ranch Road",
    //     addr2: "",
    //     cityState: "Sun Valley, ID 83342"
    //   },
    //   date: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
    //   invoiceNum: 1234,
    //   text: 'hello world',
    //   terms: "Due upon receipt.",
    //   project: "Lake house",
    //   items: [
    //     {
    //       name: "Item 2",
    //       desc: "An item used for building stuff.",
    //       cost: 45.67
    //     },
    //     {
    //       name: "Item 1",
    //       desc: "Another item used for building stuff.",
    //       cost: 12.34
    //     }
    //   ],
    //   footer: "Past due accounts of 30 days will be " 
    //         + "billed a finance charge of 21% APR, 1.75% Monthly rate, "
    //         + "or .058% Daily rate"
    // };
    
    
      
    
  }
}

module.exports = reports;

exports.invoice = function( invoice, outfile )
{
    
};