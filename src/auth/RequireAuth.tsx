import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RequireAuth = ({ children }) => {

    const auth = useSelector((store:any) => store.user.value)
    console.log(auth)

    if(!auth.token){
        return <Navigate to={"/login"} />
    }

    return children
}

export default RequireAuth
