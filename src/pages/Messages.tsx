import { Person } from "@mui/icons-material"
import Rahul from "../static/rahul.jpg"
import { StyledObject } from "styled-components"
let AvatarStyle: StyledObject = { width: '60px', height: '60px', borderRadius: '50px' }

const Profile = ({img = null}) => {
    return (
        <div className="d-flex align-items-center p-3">
        {img && <img src={Rahul} alt="Rahul" style={AvatarStyle} />}
        {/* {!img && <div className="bg-secondary" style={AvatarStyle}></div>} */}
        {!img && <Person style={AvatarStyle} />}
            
            <div className="px-3">
                <div style={{fontWeight: 500}}> rahulkr.dev53</div>
                <h6 className="text-secondary m-0"> Lorem ipsum is a sample text</h6>
            </div>
        </div>
    )
}

const Messages = () => {
  return (
    <>
        <div className="container">
            <div className="py-3 d-none d-md-block"></div>
            <div className="row">
                <div className="col-md-4">

                    <div className="card" style={{height: '80vh'}}> 
                        <h2 className="p-2 px-4 display-6">Messages</h2> 
                        <div className="card-body">
                            <Profile img={Rahul} />
                            <Profile img={Rahul} />
                            <Profile img={Rahul} />
                            <Profile img={Rahul} />
                        </div>
                    </div>


                </div>
                <div className="col-md-8">
                    
                    {/* <Profile /> */}

                </div>
            </div>
        </div> 
    </>
  )
}

export default Messages
