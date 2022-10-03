const data = {
    chat: require('../data/chat.json'),
    setChat: function(data) {this.chat=data}
};
const fsPromises = require('fs').promises;
const path = require('path')
const getAllChat= (req,res) => {
    res.json(data.chat);
}
const getAllUser = (req,res) => {
    const user = data.chat.find(message => message.user == req.body.user);
    if(!user){
        return res.status(400).json({'message' : `User ${req.body.user} has no messages`});
    }
    res.json(user)
}
const createNewMessage =  (req, res) => {
    const reqMessage = req.headers.authorization.split('|')[1];
    console.log(reqMessage);
    const newMessage = {
        user: req.user,
        message: reqMessage
    }
    data.setChat([...data.chat, newMessage]);
    fsPromises.writeFile(
        path.join(__dirname, '..', 'data','chat.json'),
        JSON.stringify(data.chat)
    );
    res.json(data.chat);
}

module.exports = {
    getAllChat,
    createNewMessage,
    getAllUser
}