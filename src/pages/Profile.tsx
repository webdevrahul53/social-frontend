import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSnack } from "../redux/snackSlice/snackSlice";
import { setUser } from "../redux/userSlice/userSlice";

const API = process.env.REACT_APP_API_URL

const PostSkeleton = () => {
    return (
        <>
            {[1,2,3,4,5].map(e => {
                return <div key={e} className="col-6 col-md-4 p-1">
                <div className="w-100 bg-light border" style={{height: '200px'}}></div>
            </div>
            })}
        </>
    )
}

const Post = ({ post, onDelete }) => {

    const confirmAndDelete = () => {
        let shouldDelete:boolean = window.confirm('Are you sure you want to delete this post');
        if(shouldDelete) onDelete(post._id)
    }

    return (
        <>
            <div className="col-6 col-md-4 p-1">
                {/* <div className="w-100 bg-light border" style={{height: '200px'}}></div> */}
                <img src={API + 'uploads/posts/' + post.image.filename}  alt="" width={'100%'} height={'200px'}
                style={{ cursor: 'pointer'}} onClick={confirmAndDelete} />
            </div>
        </>
    )
}

const Profile = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const authUser = useSelector((state: any) => state.user.value)
    const [user, setUsers] = useState(null);
    const [value, setValue] = useState(0);
    const [posts, setPosts] = useState([])
  

    useEffect(() => {
        getUserById();
    },[])

    useEffect(() => {
        fetchPosts();
    },[user])

    const getUserById = async () => {
        try {
            const user = await fetch(API + 'users/' + params.id);
            const parsedUser = await user.json()
            if(parsedUser) setUsers(parsedUser)
        }catch(err) {  }
    }

    const fetchPosts = async () => {
        if(!params.id) return;
        try {
            const post = await fetch(API + 'posts/user/' + params.id);
            const parsedpost = await post.json()
            console.log(parsedpost);
            setPosts(parsedpost)
        }catch(err) {

        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    const handleProfileImageUpload = async (event: any) => {
        let file = event?.target?.files[0]
        if(!file) return;
        let form: FormData = new FormData()
        form.append('image', file)
        try {
            const profile = await fetch(API + 'users/update_avatar/' + authUser._id, {
                method: "PATCH",
                body: form,
                headers: { "Authorization": "Bearer " + authUser.token }
            })
            const parsedProfile = await profile.json();
            if(parsedProfile.status) { getUserById(); }
        }catch(err) {
            console.log(err)
        }
    }

    const handlePostUpload = async (event: any) => {
        let file = event?.target?.files[0]
        event.target.value = ''
        let caption = prompt('Write caption for this post')
        if(!file || !caption) return;
        let form: FormData = new FormData()
        form.append('user_id', authUser._id)
        form.append('caption', caption)
        form.append('image', file)

        try {
            const post = await fetch(API + 'posts/', {
                method: "POST",
                body: form,
                headers: { "Authorization": "Bearer " + authUser.token }
            })
            const parsedPost = await post.json();
            if(parsedPost.status) { fetchPosts(); }
            else dispatch(setSnack({message: parsedPost.message}))
        }catch(err) {
            console.log(err)
        }

    }

    
    const handlePostDelete = async (id: string) => {
        try {
            const post = await fetch(API + 'posts/' + id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + authUser.token }
            })
            const parsedPost = await post.json();
            if(parsedPost.status) { dispatch(setSnack({message: 'Post Deleted'})); fetchPosts(); }
            else dispatch(setSnack({message: parsedPost.message}))
        }catch(err) {
            console.log(err)
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
          if(parsedfollow.status) getUserById();
          else dispatch(setSnack({message: parsedfollow.message}))
        }catch(err) { }
    
    }
  return (
    <>
        <div className="container">
            <div className="py-3 d-none d-md-block"></div>
            <div className="row">
                <div className="col-12 col-md-7 order-2 order-md-1">

                    <div className="">
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="Post" />
                            {/* <Tab label="Disabled" disabled /> */}
                            <Tab label="Saved" />
                        </Tabs>

                        <div className="container-fluid px-0 mt-3">
                            <div className="row">
                                {posts.length ? posts?.map(e => {
                                    return <Post key={e._id} post={e} onDelete={handlePostDelete} />
                                }) : <PostSkeleton />}
                                
                            </div>
                        </div>

                    </div>

                </div>
                <div className="col-12 col-md-5 order-1 order-md-2">
                    <div className="card p-2 p-md-5 mt-2">
                        <input type="file" id="avtar_file" accept=".jpg, .jpeg, .png" hidden  onChange={handleProfileImageUpload}/>
                        
                        <label htmlFor="avtar_file">
                            {user?.avatar ? 
                            <img src={API + 'uploads/avatars/' + user.avatar?.filename} alt="" style={{width: '120px', height: '120px', cursor: 'pointer', borderRadius: '50%'}} /> : 
                            <AccountCircle style={{width: '120px', height: '120px', cursor: 'pointer'}} /> } 
                        </label>
                        
                        
                        <div className="card-body">
                            <h6>{user?.email}</h6>
                            <div className="display-6">{user?.name}</div>
                            <div className="d-flex align-items-center mt-2">
                                <h5 className="pe-3"><strong>{posts?.length}</strong> Posts</h5>
                                <h5 className="pe-3"><strong>{user?.followers?.length}</strong> Followers</h5>
                                <h5 className="pe-3"><strong>{user?.following?.length}</strong> Following</h5>
                            </div>
                            <div className="mt-3">
                                <input type="file" id="post_file" accept=".jpg, .jpeg, .png" hidden onChange={e => handlePostUpload(e)} />
                                {authUser?._id === user?._id ? 
                                <>
                                    {/* <button className="btn btn-lg btn-primary me-3">Edit Profile</button>  */}
                                    <label htmlFor="post_file"><div className="btn btn-lg btn-outline-primary me-3">+ Post</div></label>
                                </> : user?.followers.includes(authUser._id) ? <button className="btn btn-lg btn-outline-primary me-3" onClick={() => startedFollowing(user._id, 'DELETE')}>Unfollow</button> :
                                <button className="btn btn-lg btn-primary me-3" onClick={() => startedFollowing(user._id, 'POST')}> {user?.following.includes(authUser._id) ? 'Follow back':'Follow'} </button>}
                                {authUser ? <span className="ms-2" onClick={() => dispatch(setUser({}))}><Logout style={{width: '40px', height: '40px'}} /></span> : 
                                <Settings style={{width: '40px', height: '40px'}} />}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </>
  )
}

export default Profile
