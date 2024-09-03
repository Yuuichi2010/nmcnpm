const express = require("express");
const router = express.Router();
const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const dataChat = require('../db/chat.json');
const fs = require('fs');

router.get('/chatbox/:_id', async (req, res, next) => {
    // console.log(dataFilter);
    try {
        if (req.isAuthenticated()) {
            const _id = req.params._id;
            let dataFilter = (dataChat.message).filter(e => e.username == _id)
            return res.render('admin/Chatbox', {
                title: 'Chat Management',
                mainJs: () => "empty",
                layout: 'admin',
                data: dataChat,
                uniChat: dataFilter,
                _id: _id
                // conversation: conversation
            });
        }
        else {
          res.redirect("/account/login");
        }
    } catch (err) {
        next(err);
        console(err);
    }
});
router.post('/user-chat', async (req, res, next) => {
    const {msg, isAdmin } = req.body;
    const username = req.user.UserName;
    const fileData = fs.readFileSync('./db/chat.json', "utf8");
    const jsonData = JSON.parse(fileData);
    let usernames = jsonData.conversation.c_name;
    let msgs = jsonData.message;
    // let lastMessage = jsonData.lastMessage;
    let message = jsonData.conversation
    let checkUsername = usernames.filter(a => a.username == username);
    if (checkUsername.length < 1) {
        let newDataConversation = {
            username: username,
            lastMessage: msg
        }
        let newDataMessage = {
            username: username,
            contents: [{
                msg: msg,
                isAdmin: false
            }]
        }
        usernames.push(newDataConversation);
        msgs.push(newDataMessage)
        fs.writeFile("./db/chat.json", JSON.stringify(jsonData), err => {
            if (err) throw err;
            console.log("New data added");
        })
    } else {

        let contentByUsername = msgs.filter(a => a.username == username)
        // console.log(contentByUsername);
        let addDataMessage = {
            msg: msg,
            isAdmin: false
        };
        checkUsername[0].lastMessage = msg;
        (contentByUsername[0].contents).push(addDataMessage);
        fs.writeFile("./db/chat.json", JSON.stringify(jsonData), err => {
            if (err) throw err;
            console.log("New data added");
        })
    }

})
router.post('/admin-chat', async (req, res, next) => {
    const { msg, isAdmin } = req.body;
    const username = req.user.UserName;
    const fileData = fs.readFileSync('./db/chat.json', "utf8");
    const jsonData = JSON.parse(fileData);
    let msgs = jsonData.message;
    let contentByUsername = msgs.filter(a => a.username == username);
    let checkUsername = (jsonData.conversation.c_name).filter(a => a.username == username);
    // console.log(checkUsername);
    let addDataMessage = {
        msg: msg,
        isAdmin: true
    };
    (contentByUsername[0].contents).push(addDataMessage);
    checkUsername[0].lastMessage = msg;
    fs.writeFile("./db/chat.json", JSON.stringify(jsonData), err => {
        if (err) throw err;
        console.log("New data added");
    })
})

module.exports = router;