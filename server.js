const express =require('express');
const app =express();
const server =require('http').Server(app);
const io= require('socket.io')(server)
const {v4: uuid} = require ('uuid');
app.use(express.static('public'));
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{debug:true});
const cors = require('cors');

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(cors())
app.use('/peerjs',peerServer)

    
app.get('/',(req,res)=>{
    res.redirect(`/${uuid()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})
io.on('connection', socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId)
        console.log(`User ${userId} connected to room ${roomId}`);

        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })
    })
})

server.listen(3030,()=>{
    console.log("server running")
})