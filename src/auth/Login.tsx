import { Instagram } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setUser } from "../redux/userSlice/userSlice"
import { useForm } from "react-hook-form"
import { auth, provider } from "../helper/firebaseConfig"
import { signInWithPopup } from "firebase/auth"
import Google from "../static/google.png";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { register, handleSubmit, setValue, formState: {errors} } = useForm();
    const [error, setError] = useState()
    const [isLoading, setLoading] = useState(false)
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        setValue("email", 'brandsonjohnson@gmail.com', { shouldDirty: true });
        setValue("password", 'brandsonjohnson', { shouldDirty: true });
    }, [])

    const onSubmit = async (data, isGoogle = false) => {
        setLoading(true)
        try {
            const url = isGoogle ? 'users/google-signin' : 'users/login'
            const user = await fetch(process.env.REACT_APP_API_URL + url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })
            let parsedUser = await user.json();
            setLoading(false)
            if(parsedUser.status){
                dispatch(setUser(parsedUser.data))
                navigate('/profile/'+parsedUser.data._id)
            }else setError(parsedUser.message)
        }catch(err) {
            setLoading(false)
            setError(err)
        }
    }

    const googleSignin = () => {
        if (isSigningIn) return; // Prevent multiple popups
        setIsSigningIn(true);

        signInWithPopup(auth,provider).then(data => {
            const {email, displayName, uid} = data.user
            onSubmit({name: displayName, email, password: uid}, true)
        }).catch(err => {
            console.log(err )
        }).finally(() => {
          setIsSigningIn(false);
        });
    }


  return (
    <>
        <div className="container">
            <div className="py-3 d-none d-md-block"></div>
            <div className="row">
                <div className="col-md-6 col-xl-4 offset-md-3 offset-xl-4">

                    <div className="card p-0 p-md-3 px-md-5 text-center">
                        <div className="mt-5 text-center">
                            <div className="d-flex justify-content-center align-items-center mb-3" style={{ gap: "10px" }}>
                                <Instagram style={{ width: '50px', height: '50px', color: '#E1306C' }} />
                                <h1 className="m-0" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>Social</h1>
                            </div>
                            <p className="d-none d-md-block" style={{ fontSize: '1rem', color: '#666' }}>Connect with your friends and the world around you.</p>
                            <p className="d-block d-md-none" style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>Connect with friends and the world around you.</p>
                        </div>

                        <div className="card-body">
                            {error && <div className="text-danger"> {error} </div>}
                            {errors?.email && <div className="text-danger"> {errors?.email.message?.toString()} </div>}
                            {errors?.email && errors?.email?.type === 'pattern' && <div className="text-danger"> Enter valid email address </div>}
                            {errors?.password && <div className="text-danger"> {errors?.password.message?.toString()} </div>}
                            
                            <form action="#" onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                <input type="text" id="login_email" {...register('email', {required: 'Enter valid email address', pattern: /^\S+@\S+\.\S+$/})} className="form-control my-2" placeholder="Email Address" />
                                <input type="password" id="login_password" {...register('password', {required: 'Password is required'})} className="form-control my-2" placeholder="Password" />
                                <button type="submit" className="btn btn-lg w-100 btn-primary mt-2" disabled={isLoading} > {isLoading ? 'Loading..':'Login'}</button>
                                <button 
                                    type="button" 
                                    className="btn btn-lg w-100 btn-outline-secondary mt-3 d-flex align-items-center justify-content-center" 
                                    onClick={googleSignin}
                                    disabled={isSigningIn}
                                    style={{ gap: "10px" }}
                                >
                                    <img src={Google} alt="Google" width={"20px"} /> 
                                    <span>Sign in with Google</span>
                                </button>

                            </form>
                        </div>
                    </div>

                    <div className="card p-4 mt-3">
                        <div className="d-flex justify-content-between">
                            <Link to={''}>Forget Password ?</Link>
                            <span>New User ? <Link to={'/register'}>Register</Link></span> 
                        </div>
                    </div>

                </div>
            </div>
        </div> 
    </>
  )
}

export default Login
