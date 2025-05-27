import { Email, Home, Instagram, Logout, Notifications, Person } from "@mui/icons-material"
import { StyledObject } from "styled-components"
import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice/userSlice";
let anchorStyle: StyledObject = { textDecoration: 'none', color: 'black' }
let AvatarStyle: StyledObject = { width: '40px', height: '40px', borderRadius: '50px', cursor: 'pointer' }

const Navbar = () => {
  const params = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state:any) => state.user.value)
  const navigate = useNavigate();
  const [bottomNav, setBottomNav] = useState('/')

  useEffect(() => {
    setBottomNav(params.pathname)
  }, [params])

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: string) => {
    setBottomNav(newValue)
    navigate(newValue)
  }

  return (
    <>
      <div className="d-none d-lg-block mb-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-2">
          <div className="container">
            <div className="display-6 cursor-pointer">
            <Link to={"/"} style={anchorStyle} className="d-flex align-items-center">
              <Instagram style={{ width: "40px", height: "40px" }} />
              <span className="ms-2 fw-bold" style={{ fontSize: "24px" }}>
                Instagram
              </span>
            </Link>
            </div>
            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button> */}
            
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll ms-4">
              <li className="nav-item">
              <Link className="nav-link active d-flex align-items-center" to={'/'} style={{fontSize: '20px', fontWeight: 'bold'}}>
                <Home style={{ marginRight: '8px' }} />
                Home
              </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to={user._id ? '/profile/'+ user._id : '/login'} style={{fontSize: '20px', fontWeight: 'bold'}}>
                <Person style={{ marginRight: '8px' }} />
                Profile
              </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to={'/messages'} style={{fontSize: '20px', fontWeight: 'bold'}}>
                <Email style={{ marginRight: '8px' }} />
                Messages
              </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to={'/'} style={{fontSize: '20px', fontWeight: 'bold'}}>
                <Notifications style={{ marginRight: '8px' }} />
                Notifications
              </Link>
              </li>
            </ul>

            {user && user?.token && <div className="ms-auto">
              {/* <img src={Rahul} alt="Rahul" style={AvatarStyle} onClick={handleClick} /> */}
              <Logout style={AvatarStyle} onClick={() => dispatch(setUser({}))} />
            </div>}
            
          </div>
        </nav>
      </div>

      <div className="d-lg-none position-fixed bottom-0 w-100 bg-light shadow-lg" style={{zIndex: 100, border: '2px solid lightgray'}}>
          <Tabs value={bottomNav} onChange={handleBottomNavChange} centered>
            <Tab value={"/"} icon={<Home />} />
            <Tab value={"/messages"} icon={<Email />} />
            <Tab value={"/notifications"} icon={<Notifications />} />
            <Tab value={user._id ? '/profile/'+ user._id : '/login'} icon={<Person  />} />
          </Tabs>

      </div>
      

    </>
  )
}

export default Navbar
