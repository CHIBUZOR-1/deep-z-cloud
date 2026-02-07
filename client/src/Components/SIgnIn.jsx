import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {setUser} from '../Redux/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../ClientUtils/Firebase';

const SIgnIn = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState({
        firstInput: '',
        password: ''
    });
    const dispatch = useDispatch();

    const handleChange = (e)=> {
        setInfo({ ...info, [e.target.name]: e.target.value });
    
    }

    const handleSubmit = async(e) => {
        try {
          e.preventDefault();
          setLoading(true);
          const { data } = await axios.post(`/api/users/signIn`, info);
          if(data.success) {
              toast.success(data.message);
              dispatch(setUser(data.details));
              console.log(details);
              setLoading(false);
              navigate('/');
          } 
        } catch (error) {
          toast.error(data.message);
        } finally {
          setLoading(false);
        }
      }
      const handleGoogleLogin = async() => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account'})
        try {
          const oauthResults = await signInWithPopup(auth, provider)
          console.log(oauthResults)
          const userData = { 
            email: oauthResults.user.email,
            googleId: oauthResults.user.uid
          };
          const{ data } = await axios.post(`/api/users/googleAuthLogin`, userData);
          if(data.success) {
            toast.success(data.message);
            dispatch(setUser(data.details));
            navigate('/');
          }
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false);
        }
      }
  return (
    <div className='flex flex-col h-screenn dark:bg-facebookDark-400 items-center gap-2'>
        <input type="text" value={info.firstInput} name='firstInput' onChange={handleChange} className='w-full max-sm:text-sm dark:bg-slate-600 dark:text-slate-100 outline-purple-500 p-2 border border-gray-400 rounded-md'  placeholder='Username/email' />
        <input type="password" value={info.password} name='password' onChange={handleChange} className='w-full max-sm:text-sm dark:bg-slate-600 dark:text-slate-100 outline-purple-500 p-2 border border-gray-400 rounded-md'   placeholder='password'/>
        <div className='w-full flex items-center justify-end p-1'>
          <p onClick={()=> navigate('/reset-password')} className='text-blue-500 hover:underline cursor-pointer'>forgot password</p>
        </div>
        <button onClick={handleSubmit} className='w-[80%] dark:border-purple-600 dark:border  flex max-sm:text-sm items-center justify-center gap-2 bg-facebookDark-400 active:bg-orange-800 p-2 outline-purple-500 text-white font-semibold rounded-md'>
            {loading ? 'signing in...' : 'sign in' }
        </button>
            <div className="flex w-full gap-1 items-center">
              <hr  className='border-slate-300 w-full'/>
              <p className='text-slate-600'>or</p>
              <hr  className='border-slate-300  w-full'/>
            </div>
        <button onClick={handleGoogleLogin} className='w-[80%] border-orange-300   border flex max-sm:text-sm items-center justify-center gap-2 bg-white active:bg-orange-300 p-2 outline-purple-500 text-slate-700 font-semibold rounded-md'>
           <FcGoogle className='text-xl' /> Google
        </button>
    </div>
  )
}

export default SIgnIn