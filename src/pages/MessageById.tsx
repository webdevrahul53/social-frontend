import { AccountCircle } from "@mui/icons-material";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { StyledObject } from "styled-components";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_SOCKET_API_URL);

const API = process.env.REACT_APP_API_URL
let AvatarStyle: StyledObject = { width: '50px', height: '50px', borderRadius: '50px' }


const MessageById = () => {
    const params = useParams();
    const authUser = useSelector((state:any) => state.user.value)
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [sending, setSending] = useState(false)

    useEffect(() => {
        socket.on('broadcast-message', getChatMessages);
    }, [socket])

    useEffect(() => {
        getUserById();
    }, [params.id])

    
    const getUserById = async () => {
        try {
            const user = await fetch(API + 'users/' + params.id);
            const parsedUser = await user.json()
            if(parsedUser) {
                setUser(parsedUser)
                getChatMessages()
            }
        }catch(err) {  }
    }

    
    const getChatMessages = async () => {
        try {
            const chat = await fetch(API + `messages/${authUser?._id}/${params.id}`, {
                method: 'GET',
                headers: { "Content-Type":"application/json", "Authorization": "Bearer " + authUser.token }
            });
            const parsedChat = await chat.json()
            if(parsedChat) { setMessageList(parsedChat.messages) }
            setTimeout(() => {
                let element = document.getElementById('messageBox');
                if(element) element.scrollTop += element?.scrollHeight;
            }, 200);
        }catch(err) {
            console.log(err)
        }
    }

    const sendMessage = async (id: string) => {
        if(!message) return
        setSending(true)
        try {
            let payload = { senderId: authUser._id, recipientId: id, messageText: message}
            const chat = await fetch(API + 'messages', {
                method: "POST", body: JSON.stringify(payload),
                headers: { "Content-Type":"application/json", "Authorization": "Bearer " + authUser.token }
            });
            const parsedChat = await chat.json()
            if(parsedChat.status) {
                socket.emit('message-sent', message)
                setMessage('')
                setSending(false)
                getChatMessages();
            }
            
        }catch(err) {  }
    }


  return (
    <>
        <div className="card" style={{height: '100%'}}>
            <div className="d-flex align-items-center p-3">
                <Link to={'/profile/' + user?._id} style={{textDecoration:'none', color: 'black'}}>
                    <div className="d-flex align-items-center p-2 px-md-4">
                        {user?.avatar ? <img src={user?.avatar} alt="Rahul" style={AvatarStyle} /> : 
                        <AccountCircle style={AvatarStyle} />}
                        
                        <div className="px-3">
                            <div style={{fontWeight: 500}}> {user?.email.split('@')[0]}</div>
                            <h5 className="text-secondary m-0"> {user?.name}</h5>
                        </div>
                    </div>
                </Link>
                <div className="ms-auto d-md-none">
                    <Link to={'/messages'}> <CloseIcon style={{width: '40px', height: '40px'}} /> </Link>
                </div>
            </div>

            <div id="messageBox" className="mt-3 px-3 px-md-5" style={{height: '68%', overflow: 'auto'}}>
                {messageList?.map(e => {
                    return <div key={e._id} className="d-flex align-items-center py-2"> 
                        <div>
                            {e?.senderId?.avatar ? <img src={e?.senderId?.avatar} alt="Rahul" style={{width: '30px', height: '30px', borderRadius: '50%'}} /> : 
                            <AccountCircle style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                        </div>
                        <div className="p-1 px-2 ms-2 bg-light border rounded"> {e?.text} </div>
                    </div>
                })}
            </div>
            <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <form action="#" onSubmit={(e) => {e.preventDefault();sendMessage(user._id)}} className="d-flex align-items-center p-2 p-md-4">
                    <input type="text" className="form-control p-2 p-md-3 px-4" value={message} onChange={e => setMessage(e.target.value)} placeholder="Send a message" />
                    <button type="submit" className="btn btn-md-lg btn-primary px-3 ms-2 ms-md-4" disabled={sending}> {sending ? 'Loading..':'Send'}</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default MessageById
