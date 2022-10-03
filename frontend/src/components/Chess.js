import { isCursorAtEnd } from '@testing-library/user-event/dist/utils';
import { useEffect,useRef,useState} from 'react';
import { Chess } from 'chess.js'
import Chat from './Chat'


export default function Chesss(){
    const pieces = {
        "b": {
            "r":"\u265C",
            "n":"\u265E",
            "b":"\u265D",
            "q":"\u265B",
            "k":"\u265A",
            "p":"\u265F"
        },
        "w": {
            "r":"\u2656",
            "n":"\u2658",
            "b":"\u2657",
            "q":"\u2655",
            "k":"\u2654",
            "p":"\u2659"
        }
    }
    const[join,setJoin] = useState(true);
    const[attempt,setAttempt] = useState(true);
    const[lobbyData,setLobbyData] =  useState({})
    const[select,setSelect] = useState("")
    const accessToken = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    const[obj,setObj] = useState(new Chess())
    const[userTimer,setUserTimer] = useState(180000)
    
    
    const MINUTE_MS = 500;

    useEffect(() => {
    const interval = setInterval(() => {
        getBoard()
    }, MINUTE_MS);

    return () => clearInterval(interval); 
    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("kill yourself, NOW!!!!!")
            changeTimer()
        }, MINUTE_MS);
    return () => clearInterval(interval); 
    }, [])
  
    useEffect(() => {
        if(join===false){
            changeBoard()
        }
    },[lobbyData])
    function changeTimer(){
        console.log(lobbyData.toMove)
        if(lobbyData.toMove===user){
            setUserTimer(prevTime => prevTime-500)
            if(userTimer<0){
                console.log("YOU ARE OUT OF TIME!!!!!!")
                setAttempt(true)
                setJoin(true)
                
                resignGame()
            }
        }
    }
    function getBoard(){
        try{
            fetch('http://localhost:3500/chess/board', {
                method: 'get',
                headers: {"Authorization":`Bearer ${accessToken}`}
            })
            .then( async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if(data.join){
                    setAttempt(false)
                    setJoin(true)
                }
                else if(!data.board){
                    setJoin(true)
                    setAttempt(true)                  
                }
                else if(data!==false&&data.toMove!==""&&data.toNotMove!==""){
                    setJoin(false)
                    setAttempt(false)
                    setLobbyData(data)
                }
                /*
                const temp = {
                    board:[],
                    toMove:data.toMove,
                    toNotMove:data.toNotMove
                }
                data.board.map(move => {
                    temp.board.push(move)
                })
                */
                
            });
        }
        catch(err){
            if(err.response.status===401){
                console.log("fuck you")
                setJoin(true)
            }
            console.log(err);
        }
    }
    function changeBoard(){
        const tempObj = new Chess()
        if(!lobbyData.board){
            setJoin(true)
            setAttempt(true)
            return
        }
        lobbyData.board.map(curMove => {
            let tempSplit = curMove.split("-")
            tempObj.move({from:tempSplit[0],to:tempSplit[1]})
        })
        setObj(tempObj)
        if(obj.game_over()){
            resignGame()
        }
    }
    function makeMove(message){
        const splitMessage = message.split("-")
        if(!obj.move({from:splitMessage[0],to:splitMessage[1]})){
            console.log("invalid move")
            return 
        } 
         try{
            fetch('http://localhost:3500/chess', {
                method: 'POST',
                headers: {"Authorization":`Bearer ${accessToken} |${message}`}
            })
            .then( async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
            });
        }
        catch(err){
            console.log(err);
        }
        
    }
    function joinGame(){
        setAttempt(false)
        setUserTimer(180000)
        try{
            fetch('http://localhost:3500/chess', {
                method: 'get',
                headers: {"Authorization":`Bearer ${accessToken} `}
            })
            .then( async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if(data!==false&&data.toMove!==""&&data.toNotMove!==""){
                    setJoin(false)
                }
                else{
                    setJoin(true)
                }
            });
        }
        catch(err){
            setAttempt(true)
            setJoin(true)
            console.log(err)
        }
    }
    function resignGame(){
        setAttempt(true)
        setJoin(true)
        try{
            fetch('http://localhost:3500/chess/board', {
                method: 'POST',
                headers: {"Authorization":`Bearer ${accessToken}`}
            })
            .then( async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
            });
        }
        catch(err){
            console.log(err)
        }
    }
    function incrementChar(start,addition){
        return String.fromCharCode(start.charCodeAt(0) + addition)
    }
    function selectTile(prop){
        let y = 8 - Math.floor(prop.value/8)
        let x = prop.value%8
        let tileVal = incrementChar('a',x)+incrementChar('0',y)
        if(select===""){
            setSelect(tileVal)
        }
        else{
            const temp = select+"-"+tileVal
            console.log(temp)
            makeMove(temp)
            setSelect("")
        }
    }
    function returnBoard(){
        let y = 0
        return(
        obj.board().map(row => {
            let x = 0
             y+=1
            return row.map(tile => {
                const num = x + (y-1)*8
                let temp  = x+y
                let color = "black"
                x+=1
                if(temp%2===1){
                    color = "white"
                }
                if(tile===null){
                    return (
                        <button value = {num} onClick={(e)=>selectTile(e.target)} class={color}></button>
                    )
                }

                return (<button value = {num} onClick={(e)=>selectTile(e.target)} class={color}>{pieces[tile.color][tile.type]}</button>)
                
            })
           
        })
        )
    }
    function isInMatch(){
        if(join){
            return (
                <div>Looking for game...</div>
            )
        }
        else{
            return (
            
            <div>
                <div>you: {Math.floor(userTimer/36000)}:{(userTimer%36000)/1000}</div>
                <div class="chessboard">
                    
                {returnBoard()}
                </div>
                <button 
                onClick={()=>resignGame()}
                className="form--submit"
                >Resign Game
                </button>
                </div>
            )
        }
    }
    return (
        <div>
            {
                attempt?
                <button  
                onClick={()=>joinGame()}
                className="form--submit"
                >Join Game
                </button>
                :
                isInMatch()
            }
        </div>
    )
}