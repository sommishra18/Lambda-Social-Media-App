class chatEngine{
    constructor(chatBoxId, userEmail , userAvatar){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userAvatar = userAvatar;
        this.socket = io.connect('http://54.166.161.160:5000');
        if(this.userEmail){
            this.connectionHandler();
        }

    }

    connectionHandler(){
        let self = this;
        console.log('avatar bhai' , self.userAvatar);

        this.socket.on('connect' , function(){
            console.log('Connection established using sockets!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'lambda'
            });

            self.socket.on('user_joined',function(data){
                console.log('A user joined!', data);
            });
        });

    // Send a msg on clicking the send message button

    $('#send-message').click(function(){
        let msg = $('#chat-message-input').val();

        if(msg != ''){
            self.socket.emit('send_message',{
                message: msg,
                user_email: self.userEmail,
                user_avatar: self.userAvatar,
                chatroom: 'lambda'
            });
        }
    });

    self.socket.on('receive_message', function(data){
        console.log('Message Received!', data.message);

        let newMessage = $('<li>');
        let messageType = 'other-message';

        if(data.user_email == self.userEmail){
            messageType = 'self-message';
        }
        
        console.log('avatar' , data.user_avatar);
        newMessage.append($('<img>', {
            'src': data.user_avatar,
            'alt': 'Image description'
        }));

        newMessage.append($('<span>' , {
            'html' : data.message
        }));


        console.log(data);
        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);
    })

    };
}
