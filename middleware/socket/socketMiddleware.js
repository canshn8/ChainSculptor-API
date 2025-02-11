const rateLimit = {};

const socketMiddleware = (socket,next) => {
    console.log(`[Middleware] New Connection Attempt : ${socket.id}`);

    const currentTime = Date.now();
    if(rateLimit[socket.id] && currentTime - rateLimit[socket.id] < 1000){
        console.log(`[Middleware] User ${socket.id} is sending messages too fast!`);
        return next(new Error('Too many requests, slow down!')); 
    };
    rateLimit[socket.id] = currentTime;

    if(!socket.handshake.auth || !socket.handshake.auth.token) {
        console.log(`[Middleware] Unauthorized connection attempt: ${socket.id}`);
        return next(new Error('Authentication failed! No token provided.'));
    };

    console.log(`[Middleware] Connection authorized for ${socket.id}`);
    next(); 
    
};

module.exports = socketMiddleware;
