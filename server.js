var net = require('net');

var port = 6969;
var server = net.createServer(connection);
var clients = [process.stdout];
var kicked;

process.stdin.on('data', function(data){
  if(data.toString().indexOf("\kick") !== -1){
    kicked = data.toString().split("\kick ")[1].replace("\n", "");
    clients.forEach(function(client){
      if(client.username === kicked){
        client.write("YOU HAVE BEEN KICKED, BITCH\n");
        client.end();
        clients.splice(clients.indexOf(client), 1);
        broadcast("[ADMIN]: " + kicked + " has been kicked\n", process.stdout);
      }
    });
  } else {
    broadcast("[ADMIN]: " + data.toString(), process.stdout);
  }
});

function connection(socket){
  console.log(socket);
    socket.write('Welcome\nPlease Create Username: ');
    socket.on('data', function(data){
      console.log("clients: ", clients.length);
    if (clients.indexOf(socket) === -1){
      socket.username = data.toString().replace("\n", "");
      if (clients.every(function(client){
        return socket.username !== client.username && socket.username !== "[ADMIN]";
      })){
        clients.push(socket);
        socket.write((clients.length - 1) + " in chat room\n");
        broadcast(socket.username + " has entered chat room\n", socket);
      }else{
        socket.write('Username Taken, Please Create New Username: ');
      }
    } else {
      broadcast(socket.username + ": " + data, socket);
    }});
    socket.on('end', function(){
      if(socket.username !== kicked){
      broadcast(socket.username + " has left chat room\n", socket);
      clients.splice(clients.indexOf(socket), 1);
      }
      broadcast((clients.length - 1) + " left in chat\n", socket);
    });
}

function broadcast(message, sender){
  clients.forEach(function(client){
    if(client !== sender){
      client.write(message);
    }
  });
}


server.listen({'port': port}, function() {
  address = server.address();
  console.log("opened server on %j", address);
});