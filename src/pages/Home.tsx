import { MoreVert, Person } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import EfilTower from "../static/efiltower.jpg";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { StyledObject } from "styled-components";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Rahul from '../static/rahul.jpg';

let IconStyle: StyledObject = { fontSize: '40px', marginRight: '10px', }
let AvatarStyle: StyledObject = { width: '60px', height: '60px', borderRadius: '50px' }
let AvatarStatusStyle: StyledObject = { width: '90px', height: '90px', border: '5px solid lightblue', borderRadius: '50px', padding: '4px' }
let AvatarStatusMobileStyle: StyledObject = { width: '80px', height: '80px', borderRadius: '50px', border: '2px solid lightblue', padding: '2px' }


const StatusProfile = () => {
  return (
    <>
      <div className="p-3" style={{maxWidth: '130px'}}>
        <img src={Rahul} alt="Rahul" className="d-none d-md-block" style={AvatarStatusStyle} />
        <img src={Rahul} alt="Rahul" className="d-md-none" style={AvatarStatusMobileStyle} />
        <div className="text-center"> <strong>rahulkr..</strong> </div>
      </div>
    </>
  )
}

const Profile = ({img = null}) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center p-3">
            {img && <img src={Rahul} alt="Rahul" style={AvatarStyle} />}
            {/* {!img && <div className="bg-secondary" style={AvatarStyle}></div>} */}
            {!img && <Person className="shadow-sm p-1 border" style={AvatarStyle} />}
          
            <div className="px-3">
              <div style={{fontWeight: 500}}> rahulkr.dev53</div>
              <h5 className="text-secondary m-0"> Rahul Kumar</h5>
            </div>
        </div>
        
        <div className="ms-auto pe-3">
          <button className="btn btn-primary">Switch</button>
        </div>
      </div>
    </>
  )
}

const PostCard = () => {
  return (
    <>
      <div className="card my-2" style={{width: '100%'}}>
        {/* Card Header */}
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center p-3">
            <img src={Rahul} alt="Rahul" style={AvatarStyle} />
            <div className="px-3">
              <div> Rahul Kumar</div>
              <a href="">Edit Profile</a>
            </div>
          </div>
          <div className="ms-auto pe-3">
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <img src={EfilTower} width={'100%'} alt="Efil Tower" />
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div>
              <FavoriteBorderIcon style={IconStyle} />
              {/* <FavoriteIcon style={IconStyle} /> */}
              <CommentIcon style={IconStyle} />
            </div>
            <div className="ms-auto">
              {/* <BookmarkIcon style={IconStyle} /> */}
              <BookmarkBorderIcon style={IconStyle} />

            </div>
          </div>
          <div className="card-text"> <strong>rahulkr.dev53</strong>  caption for the post </div>
          <a href="">View all comments</a>
          <div className="d-flex align-items-center mt-3">
            <input type="text" className="form-control" placeholder="Add a comment" />
            <button className="btn btn-primary px-3 ms-2">Post</button>
          </div>
        </div>
      </div>
    </>
  )
}


const Home = () => {

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col-md-7">

          <div className="card my-2">
            <div className="d-flex align-items-center">
              <StatusProfile />
              <StatusProfile />
            </div>
          </div>

          <PostCard />

        </div>

        <div className="col-md-4 d-none d-md-block offset-md-1">

          <Profile img={Rahul} />

          <div className="d-flex justify-content-between mt-3">
            <h5 className="text-secondary">Suggested People</h5>
            <div>See all</div>
          </div>

          <Profile />
          <Profile />


        </div>
      </div>
    </div>
  )
}

export default Home
