const express = require("express");
const app=express();
const http=require("http").Server(app);
const io=require("socket.io")(http);

app.use(express.static(__dirname+'/public'));

app.get("/",function(request,response){
    response.sendFile(__dirname+"/public/index.html");
});

// Checking if the users connect
io.on("connection",(socket)=>{
    console.log("A user connected");
    // Checking if the users disconnect
    socket.on("disconnect",()=>{
        console.log("A user disconnected");
    });
    socket.on("message",(message)=>{
        console.log("message",message);
        // Broadcasting this message to all the users that are connected
        io.emit("message",message);
    });
});

http.listen(3000,function(){
    console.log("server start");
});