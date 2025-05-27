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
        {user?.avatar ? <>
          <img src={user?.avatar} className="d-none d-md-block" alt="" style={AvatarStatusStyle} />
          <img src={user?.avatar} className="d-md-none" alt="" style={AvatarStatusMobileStyle} />
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
              {user?.avatar ? <img src={user?.avatar} alt="Rahul" style={AvatarStyle} /> : 
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
  const [postData, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setPost(post);
  }, []);

  const whenLiked = (id: String) => {
    let updatedLikes = [...postData?.likes];
    const isLiked = updatedLikes.includes(authUser._id);

    // Optimistically update the UI
    if (isLiked) {
      updatedLikes = updatedLikes.filter((userId) => userId !== authUser._id);
    } else {
      updatedLikes.push(authUser._id);
    }
    setPost({ ...post, likes: updatedLikes });

    // Send the request to the server
    const path = isLiked ? "unlike" : "like";
    fetch(API + "posts/" + path + "/" + id, {
      method: "PATCH",
      body: JSON.stringify({ user_id: authUser._id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authUser.token,
      },
    })
      .then((response) => response.json())
      .then((parsedlikes) => {
        if (!parsedlikes.status) {
          // Revert the optimistic update if the request fails
          setPost(post);
          dispatch(setSnack({ message: parsedlikes.message }));
        }
      })
      .catch((err) => {
        console.log(err);
        // Revert the optimistic update if there's an error
        setPost(post);
      });
  };

  const addComment = async (id: string) => {
    if (!comment.trim()) return;

    // Optimistically update the UI
    const newComment = {
      _id: Date.now().toString(), // Temporary ID for UI
      user_id: authUser._id,
      email: authUser.email,
      text: comment,
    };
    const updatedComments = [...(postData?.comments || []), newComment];
    setPost({ ...post, comments: updatedComments });
    setComment("");

    try {
      const payload = {
        user_id: authUser._id,
        email: authUser.email,
        text: comment,
      };
      const response = await fetch(API + "posts/add_comment/" + id, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authUser.token,
        },
      });
      const parsedResponse = await response.json();

      if (parsedResponse.status) {
        setPost({ ...post, comments: parsedResponse?.post?.comments });
      } else {
        // Revert optimistic update if the request fails
        setPost(post);
        dispatch(setSnack({ message: parsedResponse.message }));
      }
    } catch (err) {
      console.error(err);
      // Revert optimistic update if there's an error
      setPost(post);
    }
  };

  return (
    <div className="card my-3 shadow-sm" style={{ borderRadius: "10px" }}>
      {/* Card Header */}
      <div className="d-flex align-items-center p-3">
        <Link to={"/profile/" + postData?.user_id._id}>
          <img
            src={postData?.user_id?.avatar}
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Link>
        <div className="px-3">
          <h6 className="m-0" style={{ fontWeight: "bold" }}>
            {postData?.user_id.email}
          </h6>
          <div className="text-secondary" style={{ fontSize: "12px" }}>
            Location
          </div>
        </div>
        <div className="ms-auto">
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        </div>
      </div>

      {/* Post Image */}
      <div style={{ position: "relative" }}>
        <img
          src={postData?.image}
          alt="Post"
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
          }}
          onDoubleClick={() => whenLiked(postData?._id)}
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="d-flex align-items-center mb-2">
          <div>
            {!postData?.likes.includes(authUser._id) ? (
              <span
                onClick={() => whenLiked(postData?._id)}
                style={{ cursor: "pointer" }}
              >
                <FavoriteBorderIcon style={{ fontSize: "28px" }} />
              </span>
            ) : (
              <span
                onClick={() => whenLiked(postData?._id)}
                style={{ cursor: "pointer" }}
              >
                <Favorite style={{ fontSize: "28px", color: "red" }} />
              </span>
            )}
            <CommentIcon
              style={{ fontSize: "28px", marginLeft: "10px", cursor: "pointer" }}
            />
          </div>
          <div className="ms-auto">
            <BookmarkBorderIcon style={{ fontSize: "28px", cursor: "pointer" }} />
          </div>
        </div>
        <div>
          <strong>{postData?.likes?.length} likes</strong>
        </div>
        <div className="mt-2">
          <strong>{postData?.user_id?.email}</strong> {postData?.caption}
        </div>
        {postData?.comments?.slice(0, 2).map((e) => (
          <div key={e._id} className="mt-1">
            <strong>{e?.email}</strong> {e?.text}
          </div>
        ))}
        {postData?.comments?.length > 2 && (
          <Link to={""} className="text-secondary" style={{ fontSize: "14px" }}>
            View all {postData?.comments?.length} comments
          </Link>
        )}
      </div>

      {/* Add Comment */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addComment(post._id);
        }}
        className="d-flex align-items-center p-3 border-top"
      >
        <input
          type="text"
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ border: "none", outline: "none" }}
        />
        <button
          type="submit"
          className="btn btn-link text-primary"
          style={{ fontWeight: "bold" }}
        >
          Post
        </button>
      </form>
    </div>
  );
};


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

  const startedFollowing = async (id: String, method: 'POST' | 'DELETE') => {
    try {
      const payload = { followed_by: authUser._id, followed_to: id };
      
      // Optimistically update the UI
      const updatedAvatars = avatars.map((user) => {
        if (user._id === id) {
          return {
            ...user,
            followers: method === 'POST'
              ? [...user.followers, authUser._id]
              : user.followers.filter((followerId) => followerId !== authUser._id),
          };
        }
        return user;
      });
      setAvatars(updatedAvatars);

      const response = await fetch(API + 'followers', {
        method,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authUser.token,
        },
      });
      const parsedResponse = await response.json();

      if (!parsedResponse.status) {
        // Revert optimistic update if the request fails
        fetchAvatars();
        dispatch(setSnack({ message: parsedResponse.message }));
      }
    } catch (err) {
      console.error(err.message);
      // Revert optimistic update if there's an error
      fetchAvatars();
    }
  };

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
                return <div key={e} className="col-lg-6 py-2">
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

          {false ? [1,2,3,4].map(e => {
            return <div key={e} className="d-flex align-items-center px-3 py-2">
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
