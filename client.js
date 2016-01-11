var net = require('net');

var client = net.connect({'port' : 6969, 'host' : '0.0.0.0'},
  function(){

    var clientAddress = client.address().address;
    var clientPort = client.address().port;
    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', function(data){
      client.write(data);
    });

    client.on('data', function(data){
      process.stdout.write(data);
    });

    client.on('end', function(){
      process.stdout.write("Goodbye!\n");
    });

});