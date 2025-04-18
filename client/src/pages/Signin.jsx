import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess,signInFailure } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"

export default function SignIn() {

  const[formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })

  }
  // console.log(formData)
  const handleSubmit = async (e) => {
   
    e.preventDefault()
    try{
      dispatch(signInStart())
      
    const res = await fetch('https://real-estate-app-a14s.onrender.com/api/auth/signin',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
        }
      
    )
    const data = await res.json()
    if(data.success === false){
     dispatch(signInFailure(data.message))

      return;
    }
   dispatch(signInSuccess(data))
    navigate('/')

    }catch(err){
      dispatch(signInFailure(err.message))
    }
    
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
     
      <h1 className='text-3xl text-center font-semibold my-7'> Sign In </h1>
      <form onSubmit={handleSubmit} className='flex flex-col  gap-4'>
        
        <input type='text'
        placeholder='Email'
        className='border rounded-lg shadow-md p-3 outline-none'
        id='email'
        onChange={handleChange}
        />
        <input type='text'
        placeholder='Password'
        className='border rounded-lg shadow-md p-3 outline-none'
        id='password'
        onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          {loading ? 'Loading...' : 'Sign In'}
          </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have  an account</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}
