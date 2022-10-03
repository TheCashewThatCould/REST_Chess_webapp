import { useEffect,useRef,useState} from 'react';
import axios from '../api/axios';
import useRefreshToken from '../hooks/useRefreshToken';
const accessToken = localStorage.getItem('accessToken')
const user = localStorage.getItem('user')

export default function Chat () {
    const [messages,setMessages] = useState([]);
    const [userMessage,setUserMessage] = useState("");
    function getChat(){
        try{
            
            fetch('http://localhost:3500/chat', {
                method: 'GET',
                headers: {"Authorization":`Bearer ${accessToken}`}
            })
                .then( async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();
                    const arr = [];
                    data.map(message => {
                        arr.push(message);
                    })
                    setMessages(arr);
                });
        }
        catch(err){
            console.log(err);
        }
    }
    function createMessage(){
        try{
            fetch('http://localhost:3500/chat', {
                method: 'POST',
                headers: {"Authorization":`Bearer ${accessToken} |${userMessage}`}
            })
            .then(res => console.log(res))
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <div>
            <ul>
            {messages.map(message => <li>{message.user}: {message.message}</li>)||<li>no messages</li>}
            </ul>
            
            <form className="form" onSubmit={createMessage}>
                <input 
                    onChange = {(e) => setUserMessage(e.target.value)}
                    type="text"
                    placeholder="message"
                    name="userMessage"
                    value={userMessage}
                />
                <button onClick={getChat()}
                    className="form--submit"
                >createMessage
                </button>
            </form>
        </div>
    )
}

