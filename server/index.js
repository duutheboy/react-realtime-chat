const app = require("express")()
const server = require("http").createServer(app)
const io = require ("socket.io")(server, {cors: {origin: 'http://localhost:5173'}}) // cors: limita as requisições, só aceitar requisitos do URL inserido

const PORT = 3001

io.on("connection", socket => 
    {
    console.log("User connected!", socket.id) // Exibir se o usuário foi conectado e atribuir um id único para cada usuário

    socket.on("disconnect", reason => 
        {
            console.log("User desconnected!", socket.id)
        })

    socket.on("set_username", username => 
        {
            socket.data.username = username
            console.log(socket.data.username)
        })

    socket.on("message", text => 
        {
            io.emit("receive_message", 
            { // objeto com dados da mensagem, emitindo de volta para o front end / client side
                text,
                authorId: socket.id,
                author: socket.data.username
            })
        })
})

server.listen(PORT, () => console.log('Server on...'))