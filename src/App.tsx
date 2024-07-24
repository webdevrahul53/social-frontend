import * as React from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Loader from './common/Loader';
import RequireAuth from './auth/RequireAuth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/userSlice/userSlice';
const Navbar = React.lazy(() => import('./common/Navbar'));
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Login =  React.lazy(() => import('./auth/Login'));
const Register = React.lazy(() => import('./auth/Register'))

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state:any) => state.user.value)
  
  console.log(user)
  React.useEffect(() => {
    let localUser = JSON.parse(localStorage.getItem('user') as string);
    if(localUser) dispatch(setUser(localUser));
  }, [])

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/login" element={<React.Suspense fallback={<Loader />}> <Login /> </React.Suspense>}></Route>
        <Route path="/register" element={<React.Suspense fallback={<Loader />}> <Register /> </React.Suspense>}></Route>
        
        <Route path="/" element={<React.Suspense fallback={<Loader />}> <Home /> </React.Suspense>}></Route>
        <Route path="/profile" element={<React.Suspense fallback={<Loader />}> <Profile /> </React.Suspense>}></Route>
        <Route path="/messages" element={<React.Suspense fallback={<Loader />}> <RequireAuth> <Messages /> </RequireAuth> </React.Suspense>}></Route>
      </Routes>
    </>
  );
}

export default App;
