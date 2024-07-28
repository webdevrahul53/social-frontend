import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../redux/userSlice/userSlice'

const RequireAuth = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        let localUser = localStorage.getItem('user');
        console.log(localUser)
        if(localUser && localUser !== 'undefined'){
          let data = JSON.parse(localUser as string);
          if(!data.token) navigate('/login')
          dispatch(setUser(data));
        }else {
          navigate('/login')
        }
    }, [])

    return children
}

export default RequireAuth
