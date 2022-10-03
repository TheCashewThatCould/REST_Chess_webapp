const data = { 
    lobby: require('../data/board.json'),
    setLobby: function(arg) {this.lobby=arg}
}
const fsPromises = require('fs').promises;
const path = require('path');
const reqEndGame = async(req,res) => {
    const user = req.user
    const otherGames = data.lobby.filter(game => game.toMove!==user && game.toNotMove!==user)
    data.setLobby(otherGames)
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'board.json'),
        JSON.stringify(data.lobby)
    );
    res.json(otherGames)
}

const makeMove = async(req, res) => {
    const message = req.headers.authorization.split('|')
    const move = message[1]
    const user = req.user
    const token = message[0]
    const foundGame = data.lobby.find(game => game.toMove===user)
    if (!foundGame||foundGame.toNotMove==="") {
        return res.sendStatus(401); //Unauthorized 
    }
    const newBoard = [...foundGame.board,move]
    const newGame = {
        board:newBoard,
        toNotMove:foundGame.toMove,
        toMove:foundGame.toNotMove
    }
    const otherGames = data.lobby.filter(game => game.toMove !== user);
    data.setLobby([...otherGames, newGame])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'board.json'),
        JSON.stringify(data.lobby)
    );
    res.json(newGame)
}

const joinMatch = async(req, res) => {
    const message = req.headers.authorization.split('|')
    const user = req.user
    const token = message[0]
    const inGame = data.lobby.find(game => game.toMove == user || game.toNotMove==user)
    if(inGame){
        return res.json(inGame)
    }
    const foundGame = data.lobby.find(game => game.toNotMove === "")
    if(!foundGame){
        const newGame = {
            board:[],
            toMove:user,
            toNotMove:""
        }
        data.setLobby([...data.lobby,newGame])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'data', 'board.json'),
            JSON.stringify(data.lobby)
        );
        res.json(newGame)
    }
    else{
        const newGame = {
            ...foundGame,
            toNotMove:user
        }
        const otherGames = data.lobby.filter(game => game.toMove!==foundGame.toMove)
        data.setLobby([...otherGames,newGame])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'data', 'board.json'),
            JSON.stringify(data.lobby)
        );
        res.json(newGame)
    }
}
const getBoard = async(req, res) => {
    const message = req.headers.authorization.split('|')
    const user = req.user
    const token = message[0]
    const foundGame = data.lobby.find(game => game.toMove === user || game.toNotMove === user)
    
    if(!foundGame){
        return res.json({join:false})
    }
    else if(foundGame.toNotMove===""){
        return res.json({join:true})
    }
    res.json(foundGame)
}

module.exports = {makeMove,joinMatch,getBoard,reqEndGame}