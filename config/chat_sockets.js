
module.exports.chatSockets = function(socketServer){

    const io = require('socket.io')(socketServer, {
        cors: {
            origin: "http://54.166.161.160:8000",
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    });

    io.sockets.on('connection', function(socket){
        console.log('New Connection Received', socket.id);

        socket.on('disconnect', function(){
            console.log('Socket Disconnected!');
        });

        socket.on('join_room', function(data){
            console.log('Joining request recieved!', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        })
        // Detect send_message and broadcast it to everyone in the room! 

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    });


}
