import { Google, Instagram } from "@mui/icons-material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setUser } from "../redux/userSlice/userSlice"
import { useForm } from "react-hook-form"

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: {errors} } = useForm()
    const [error, setError] = useState('')
    const onSubmit = async (data) => {
        try {
            const user = await fetch(process.env.REACT_APP_API_URL + 'users/signup', {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })
            let parsedUser = await user.json();
            if(parsedUser.status){
                navigate('/login')
            }else setError(parsedUser.message)
        }catch(err) {
            setError(err)
        }
    }

  return (
    <>
      <div className="container">
            <div className="py-3 d-none d-md-block"></div>
            <div className="row">
                <div className="col-md-4 offset-md-4">

                    <div className="card p-0 p-md-3 px-md-5 text-center">
                        <div className="mt-5">
                            <Instagram style={{width: '60px', height: '60px'}} />
                            <h1 >Social</h1>
                        </div>

                        <div className="card-body">
                            {error && <div className="text-danger"> {error} </div>}
                            {errors?.name && <div className="text-danger"> {errors?.name.message?.toString()} </div>}
                            {errors?.email && <div className="text-danger"> {errors?.email.message?.toString()} </div>}
                            {errors?.email && errors?.email?.type == 'pattern' && <div className="text-danger"> Enter valid email address </div>}
                            {errors?.password && <div className="text-danger"> {errors?.password.message?.toString()} </div>}

                            <form action="#" onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                <input type="text" {...register('name', {required: 'Full name is required'})} className="form-control my-2" placeholder="Full Name" />
                                <input type="text" {...register('email', {required: 'Enter valid email address', pattern: /^\S+@\S+\.\S+$/})} className="form-control my-2" placeholder="Email Address" />
                                <input type="password" {...register('password', {required: 'Password is required'})} className="form-control my-2" placeholder="Password" />
                                <button type="submit" className="btn btn-lg w-100 btn-primary mt-2">Register</button>
                                <h6 className="m-0 mt-4 px-2" style={{cursor: 'pointer'}}> 
                                    Continue with <Google style={{width: '25px', height: '25px', color: 'green'}} />oogle  
                                </h6>

                            </form>
                        </div>

                    </div>

                    <div className="card p-3 mt-2">
                        <div className="text-center">
                            {/* <Link to={''}>Forget Password ?</Link> */}
                            <span>Already have an Account ? <Link to={'/login'}>Login</Link></span> 
                        </div>
                    </div>

                </div>
            </div>
        </div> 
    </>
  )
}

export default Register
