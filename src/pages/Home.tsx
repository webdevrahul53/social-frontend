import { AccountCircle, Favorite, MoreVert } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { StyledObject } from "styled-components";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSnack } from "../redux/snackSlice/snackSlice";
import { setUser } from "../redux/userSlice/userSlice";

const API = process.env.REACT_APP_API_URL;
const ADMIN_TOKEN = process.env.REACT_APP_ADMIN_TOKEN;


let IconStyle: StyledObject = { fontSize: '40px', marginRight: '10px', }
let AvatarStyle: StyledObject = { width: '50px', height: '50px', borderRadius: '50px' }
let AvatarStatusStyle: StyledObject = { width: '90px', height: '90px', border: '5px solid lightblue', borderRadius: '50px', padding: '4px' }
let AvatarStatusMobileStyle: StyledObject = { width: '80px', height: '80px', borderRadius: '50px', border: '2px solid lightblue', padding: '2px' }


const StatusProfile = ({ user }) => {
  
  return (
    <>
      <div className="p-2" style={{maxWidth: '130px'}}>
        {user?.avatar?.filename ? <>
          <img src={API + 'uploads/avatars/' + user?.avatar?.filename} className="d-none d-md-block" alt="" style={AvatarStatusStyle} />
          <img src={API + 'uploads/avatars/' + user?.avatar?.filename} className="d-md-none" alt="" style={AvatarStatusMobileStyle} />
        </> : <>
          <AccountCircle className="d-none d-md-block" style={AvatarStatusStyle} />
          <AccountCircle className="d-md-none" style={AvatarStatusMobileStyle} />
        </>}
        <div className="text-center"> 
          <strong style={{fontSize: '14px'}}>
          {user.email.length > 10 ? user.email.substring(0, 10) + '..' : user.email}
          </strong> 
        </div>
      </div>
    </>
  )
}

const Profile = ({ user, authUser, onFollow = null, onLogout = null }) => {
  if(!user) return <></>
  let isAuth:boolean = authUser._id === user._id;
  let hasAuthFollowed:boolean = user.followers.includes(authUser._id)
  let beingAuthFollowed: boolean = user.following.includes(authUser._id)
  return (
    <>
      <div className="d-flex align-items-center">
        <Link to={'/profile/' + user._id} style={{textDecoration:'none', color: 'black'}}>
          <div className="d-flex align-items-center p-2 px-4">
              {user?.avatar?.filename ? <img src={API + 'uploads/avatars/' + user?.avatar?.filename} alt="Rahul" style={AvatarStyle} /> : 
              <AccountCircle style={AvatarStyle} />}
              
              {/* {!img && <div className="bg-secondary" style={AvatarStyle}></div>} */}
              {/* {!img && <Person className="shadow-sm p-1 border" style={AvatarStyle} />} */}
            
              <div className="px-2">
                <div style={{fontWeight: 500}}> {user.email.split('@')[0]}</div>
                <h5 className="text-secondary m-0"> {user.name}</h5>
              </div>
          </div>
        </Link>
        
        <div className="ms-auto pe-3">
          {isAuth ? <button className="btn btn-outline-primary" onClick={onLogout}>Logout</button> : hasAuthFollowed ?
          <button className="btn btn-sm btn-outline-primary" onClick={() => onFollow(user._id, 'DELETE')}>Unfollow</button> :
          <button className="btn btn-sm btn-primary" onClick={() => onFollow(user._id, 'POST')}> {beingAuthFollowed ? 'Follow back':'Follow'} </button>
          }
          
        </div>
      </div>
    </>
  )
}

const PostCard = ({ post, authUser, dispatch }) => {

  const [postData, setPost] = useState(null)

  useEffect(() => {
    setPost(post)
  }, [])

  const whenLiked = async (id: String) => {
    try {
      let payload = { user_id: authUser._id }
      let path = postData?.likes.includes(authUser._id) ? 'unlike': 'like'
      const likes = await fetch(API + 'posts/'+path+'/'+ id, {
        method: 'PATCH', body: JSON.stringify(payload),
        headers: { "Content-Type":"application/json", "Authorization": "Bearer " + authUser.token }
      });
      const parsedlikes = await likes.json()
      if(parsedlikes.status) { setPost({ ...post, likes: parsedlikes?.post?.likes }) }
      else dispatch(setSnack({message: parsedlikes.message}))
    }catch(err) { console.log(err) } 
  }

  return (
    <>
      <div className="card my-2" style={{width: '100%', height: '100%', position: 'relative'}}>
        {/* Card Header */}
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center p-3">
            <Link to={'/profile/' + postData?.user_id._id}> <img src={API + 'uploads/avatars/' + postData?.user_id?.avatar?.filename} alt="Rahul" style={AvatarStyle} /> </Link>
            <div className="px-3">
              <h6 className="m-0"> {postData?.user_id.email} </h6>
              <div className="text-secondary">location</div>
              {/* <a href="">Edit Profile</a> */}
            </div>
          </div>
          <div className="ms-auto pe-3">
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <img src={API + 'uploads/posts/' + postData?.image?.filename} width={'100%'} alt="" onDoubleClick={() => whenLiked(postData?._id)} />
        <div className="p-2 px-3">
          <div className="py-2 pb-4">
            <div className="d-flex align-items-center">
              <div>
                {!postData?.likes.includes(authUser._id) ? <span onClick={() => whenLiked(postData?._id)} style={{cursor: 'pointer'}}> 
                  <FavoriteBorderIcon style={IconStyle} /> 
                </span>: 
                <span onClick={() => whenLiked(postData?._id)} style={{cursor: 'pointer'}}> 
                  <Favorite style={{...IconStyle, color:'red'}} /> 
                </span>}
                <CommentIcon style={IconStyle} />
              </div>
              <div className="ms-auto">
                {/* <BookmarkIcon style={IconStyle} /> */}
                <BookmarkBorderIcon style={IconStyle} />

              </div>
            </div>
            <div> <strong>{postData?.likes?.length} Likes</strong> </div>
            <div className="card-text"> <strong>{postData?.user_id?.email}</strong> {postData?.caption}</div>
            
            <Link to={""}>View all comments</Link>
          </div>
          <div className="d-flex align-items-center py-2" style={{position: 'absolute', bottom: 0, width: '90%'}}>
            <input type="text" className="form-control" placeholder="Add a comment" />
            <button className="btn btn-primary px-3 ms-2">Post</button>
          </div>
        </div>
      </div>
    </>
  )
}


const Home = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state:any) => state.user.value)
  const [authAvatar, setAuthAvatar] = useState(null)
  const [avatars, setAvatars] = useState([])
  const [posts, setPosts] = useState([])
  const [avatarLoading, setAvatarLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(true)

  useEffect(() => {
    fetchPosts();
  },[])


  useEffect(() => {
    fetchAvatars();
  },[authUser])


  const fetchPosts = async () => {
    setPostLoading(true)
    try {
        const post = await fetch(API + 'posts');
        const parsedpost = await post.json()
        setPosts(parsedpost)
        setPostLoading(false)
    }catch(err) {
        setPostLoading(false)
    }
  }
  

  const fetchAvatars = async () => {
    setAvatarLoading(true)
    try {
        const avatar = await fetch(API + 'users', {
          method: 'GET',
          headers: { "Authorization": "Bearer " + ADMIN_TOKEN }
        });
        const parsedavatar = await avatar.json()
        let index = parsedavatar.findIndex(e => e._id === authUser._id)
        setAvatarLoading(false)
        setAuthAvatar(parsedavatar[index])
        if(delete parsedavatar[index]) setAvatars(parsedavatar)
    }catch(err) {
      setAvatarLoading(false)
    }
  }

  const startedFollowing = async (id:String, method: 'POST' | 'DELETE') => {
    try {
      let payload = { followed_by: authUser._id, followed_to: id }
      const follow = await fetch(API + 'followers', {
        method, body: JSON.stringify(payload),
        headers: { "Content-Type":"application/json", "Authorization": "Bearer " + authUser.token }
      });
      const parsedfollow = await follow.json()
      if(parsedfollow.status) fetchAvatars();
      else dispatch(setSnack({message: parsedfollow.message}))
      
    }catch(err) {
      console.log(err.message);
      
     }

  }

  return (
    <div className="container mb-5">
      <div className="row">

        {/* Left Side */}
        {/* <div className="col-md-4"></div> */}
        <div className="col-md-8 order-2 order-md-1">
          {/* Posts */}
          <div className="container-fluid p-0">
            <div className="row">
              {postLoading ? [1,2,3,4].map(e => {
                return <div className="col-lg-6 py-2">
                <div className="card">
                  <div className="d-flex align-items-center p-2">
                    <div className="bg-light" style={{width: '60px', height: '60px', borderRadius: '50%'}}></div>
                    <div>
                      <h2 className="bg-light m-0 mx-2" style={{width: '120px', height: '20px'}}></h2>
                      <h2 className="bg-light m-0 mx-2 mt-1" style={{width: '120px', height: '20px'}}></h2>
                    </div>
                  </div>
                  <div className="bg-light" style={{height: '320px'}} ></div>
                </div>
              </div>
              }) :  posts?.map(e => {
                return <div key={e._id} className="col-lg-6 py-2"><PostCard post={e} authUser={authUser} dispatch={dispatch} /></div>
              })}
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="col-md-4 order-1 order-md-2 p-0">
          {/* Status */}
          <div className="card my-2 p-2">
            <div className="d-flex align-items-center" style={{overflow: 'auto', scrollbarWidth: 'none'}}>
              {authAvatar && <StatusProfile user={authAvatar} />}
              {avatars.length ? avatars?.map(e => {
                return <StatusProfile key={e._id} user={e} />
              }) : <></>}
            </div>
          </div>

          <Profile user={authAvatar} authUser={authUser} onLogout={() => dispatch(setUser({}))} />

          <div className="d-flex justify-content-between mt-3 px-3">
            <h5 className="text-secondary">Suggested People</h5>
            <div>See all</div>
          </div>

          {avatarLoading ? [1,2,3,4].map(e => {
            return <div className="d-flex align-items-center px-3 py-2">
            <div className="bg-light" style={{width: '70px', height: '70px', borderRadius: '50%'}}></div>
            <div>
              <h2 className="bg-light m-0 mx-2" style={{width: '80px', height: '20px'}}></h2>
              <h2 className="bg-light m-0 mx-2 mt-1" style={{width: '140px', height: '20px'}}></h2>
            </div>
            <h2 className="bg-light m-0 mx-2 ms-auto" style={{width: '80px', height: '40px'}}></h2>
          </div>
          }) : avatars?.map(e => {
            return <Profile key={e._id} user={e} authUser={authUser} onFollow={startedFollowing} />
          })}


        </div>
      </div>
    </div>
  )
}

export default Home
