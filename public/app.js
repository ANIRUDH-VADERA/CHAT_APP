// Message Types available
messageTypes={LEFT:"left", RIGHT:"right",LOGIN:"login"};
// messages will contain objects each containing {author,date,type,content}
const messages=[]
// CHAT
const chatWindow= document.querySelector(".chat"); 
const messageList=document.querySelector(".message-list");
const messageInput=document.querySelector(".messageInput");
const sendBtn=document.querySelector(".sendBtn");

// LOGIN
let username="";
const usernameInput=document.querySelector(".userNameInput");
const loginBtn=document.querySelector(".loginBtn");
const loginWindow=document.querySelector(".login");

var socket=io();

socket.on("message",(message)=>{
    console.log(message);
    if(message.type!==messageTypes.LOGIN)
    {
        if(message.author===username)
        {
            message.type=messageTypes.RIGHT;
        }
        else
        {
            message.type=messageTypes.LEFT;
        }
    }
    messages.push(message);
    displayMessages();
    chatWindow.scrollTop=chatWindow.scrollHeight;
});

// we take the message, and return the HTML
function createMessageHtml(message)
{
    if(message.type===messageTypes.LOGIN)
    {
        return '<p class="secondary-text text-center mb2">'+message.author+' has joined the chat</p>';
    }
    else
    {
        if(message.type===messageTypes.LEFT)
        {
            return '<div class="message message-left"><div class="message-details flex"><p class="message-author">' + message.author + '</p><p class="message-date">'+message.date+'</p></div><p class="message-content">'+message.content+'</p></div>';
        }
        else
        {
            return '<div class="message message-right"><div class="message-details flex"><p class="message-author"></p><p class="message-date">'+message.date+'</p></div><p class="message-content">'+message.content+'</p></div>';
        }
        
    }
}

function displayMessages()
{
    const messagesHTML=messages.map((message)=>createMessageHtml(message)).join("");
    messageList.innerHTML=messagesHTML;
}


// loginBtn
loginBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    if(!usernameInput.value)
    {
        return console.log("must supply a username");
    }
    username=usernameInput.value;
    loginWindow.classList.add("hidden");
    chatWindow.classList.remove("hidden");
    sendMessage(
        {
            author: username,
            type: messageTypes.LOGIN
        }
    );
});

// sendBtn
sendBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    if(!messageInput.value)
    {
        return console.log("must supply a message");
    }
    const date=new Date();
    const day=date.getDate();
    const year=date.getFullYear();
    const month=('0'+(date.getMonth()+1)).slice(-2);
    const dateString=month+'/'+day+'/'+year;

    const message={
        author: username,
        date: dateString,
        content : messageInput.value,
    }

    sendMessage(message);

    messageInput.value="";
});

function sendMessage(message)
{
    socket.emit("message",message);
}