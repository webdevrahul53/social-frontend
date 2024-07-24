import { Person, Settings } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

const PostSkeleton = () => {
    return (
        <>
            <div className="col-6 col-md-4 p-2">
                <div className="w-100 bg-light border" style={{height: '200px'}}></div>
            </div>
        </>
    )
}

const Profile = () => {
    const [value, setValue] = useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
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

                        <div className="container-fluid mt-3">
                            <div className="row">
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                            </div>
                        </div>

                    </div>

                </div>
                <div className="col-12 col-md-5 order-1 order-md-2">
                    <div className="card p-0 p-md-5">
                        <Person style={{width: '120px', height: '120px'}} />
                        <div className="card-body">
                            <h6 className="mt-1">rahulkr.dev53</h6>
                            <div className="display-6">Rahul Kumar</div>
                            <div className="d-flex align-items-center mt-2">
                                <h5 className="pe-3"><strong>32</strong> Posts</h5>
                                <h5 className="pe-3"><strong>32</strong> Followers</h5>
                                <h5 className="pe-3"><strong>32</strong> Following</h5>
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-lg btn-primary me-3">Edit Profile</button>
                                <button className="btn btn-lg btn-outline-primary me-3">Follow</button>
                                <Settings style={{width: '40px', height: '40px'}} />
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
