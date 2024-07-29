import { AccountCircle } from "@mui/icons-material"
import { StyledObject } from "styled-components"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const API = process.env.REACT_APP_API_URL;

let AvatarStyle: StyledObject = { width: '60px', height: '60px', borderRadius: '50px' }

const Profile = ({ user }) => {
    const params = useParams()
    return (
        <Link to={'/messages/' + user._id} style={{textDecoration:'none', color: 'black'}}>
            <div className={`d-flex align-items-center p-3 ${params.id === user._id ? 'bg-light shadow-sm': ''}`}>
                {user?.avatar?.filename ? <img src={API + 'uploads/avatars/' + user?.avatar?.filename} alt="Rahul" style={AvatarStyle} /> : 
                <AccountCircle style={AvatarStyle} />}
                
                {/* {!img && <div className="bg-secondary" style={AvatarStyle}></div>} */}
                {/* {!img && <Person className="shadow-sm p-1 border" style={AvatarStyle} />} */}
                
                <div className="px-3">
                    <div style={{fontWeight: 500}}> {user?.email}</div>
                    <h5 className="text-secondary m-0"> {user.name}</h5>
                </div>
            </div>
        </Link>
    )
}

const Messages = () => {
    const params = useParams()
    const authUser = useSelector((state:any) => state.user.value)
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchAvatars();
    }, [])

    const fetchAvatars = async () => {
        try {
            const avatar = await fetch(API + 'followers/followed_user/' + authUser._id, {
              method: 'GET',
              headers: { "Authorization": "Bearer " + authUser.token }
            });
            const parsedavatar = await avatar.json()
            setUsers(parsedavatar);
            
        }catch(err) { }
    }
    

  return (
    <>
        <div className="container pt-2">
            <div className="row">
                <div className={`col-md-4 ${params.id ? 'd-none d-md-block':''}`}>

                    <div className="card" 
                    style={{height: '82vh', overflow: 'auto'}}
                    > 
                        <div className="d-flex justify-content-between align-items-center py-4 px-5">
                            <h2 className="">Messages</h2> 
                            <AddIcon style={{width: '30px', height: '30px'}} />
                        </div>
                        <div className="card-body border border-top">
                            {users?.length ? users?.map(e => {
                                return <Profile key={e._id} user={e.user} />
                            }) : <></>}
                            
                        </div>
                    </div>


                </div>
                <div className="col-md-8"
                style={{height: '82vh', overflow: 'auto'}}
                >
                    <Outlet />
                    {/* <Profile /> */}

                </div>
            </div>
        </div> 
    </>
  )
}

export default Messages
