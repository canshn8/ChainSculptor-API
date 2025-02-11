const socketIo = require("socket.io");

let users = {};

const socketHandler = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log("✅ A new user connected " + socket.id);

        socket.on("setUsername", (username) => {
            users[username] = socket.id; 
            console.log(`${username} connected`);
        });

        // Mesaj gnderme
        socket.on('sendMessage', (data) => {
            const { to, message } = data;

            if (users[to]) {
                io.to(users[to]).emit('receiveMessage', { from: socket.id, message });
                console.log(`✅ Message sent to: ${to}`);
            } else {
                console.log(`❌ User not found: ${to}`);
            }
        });

        socket.on('disconnect', () => {
            for (let username in users) {
                if (users[username] === socket.id) {
                    delete users[username]; 
                    console.log(`❌ ${username} disconnected`);
                    break;
                }
            }
        });
    });
};

module.exports = socketHandler; 
