import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { setUser } from '../redux/userSlice/userSlice'

const RequireAuth = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth = useSelector((store:any) => store.user.value)

    useEffect(() => {
        let localUser = localStorage.getItem('user');
        console.log(localUser)
        if(localUser && localUser != 'undefined'){
          let data = JSON.parse(localUser as string);
          if(!data.token) navigate('/login')
          dispatch(setUser(data));
        }
    }, [])


    // if(!auth || !auth?.token){
    // }

    return children
}

export default RequireAuth
