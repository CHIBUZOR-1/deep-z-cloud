import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { logout } from '../Redux/userSlice';
import { FiMenu } from "react-icons/fi";
import MenuList from './MenuList';
import Avatarz from './Avatarz';
import { IoIosArrowDropdownCircle } from "react-icons/io"
import AvatarMenu from './AvatarMenu';
import { toast } from 'react-toastify';
import { FiSearch } from "react-icons/fi";
import { SlLogout } from 'react-icons/sl';



const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [menuDrop, setMenuDrop] = useState(false);
    const [avDrop, setAvDrop] = useState(false);
    const [kword, setKword] = useState('');
    const user= useSelector(state=> state?.user?.user);
    const dropdownRef = useRef(null); 
    const iconRef = useRef(null);
    const dropdownRef1 = useRef(null); 
    const iconRef1 = useRef(null);
    const handleLogOut = async()=> {
      const {data } = await axios.get(`/api/users/logout`);
      if(data.success) {
        toast.success(data.message);
        dispatch(logout())
        navigate('/')
      }
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside); 
      return () => { 
        document.removeEventListener("mousedown", handleClickOutside); 
      }; 
    }, []); 
    useEffect(()=> {
      const urlParams = new URLSearchParams(location.search);
      const searchfromUrl = urlParams.get('kword');
      if(searchfromUrl) {
        setKword(searchfromUrl)
      }
    }, [location.search]);
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside1); 
      return () => { 
        document.removeEventListener("mousedown", handleClickOutside1); 
      }; 
    }, []);  
    const handleClickOutside = (event) => { 
      if ( dropdownRef.current && !dropdownRef.current.contains(event.target) && iconRef.current && !iconRef.current.contains(event.target)) { 
        setMenuDrop(false);
      } 
    };
    const handleClickOutside1 = (event) => { 
      if ( dropdownRef1.current && !dropdownRef1.current.contains(event.target) && iconRef1.current && !iconRef1.current.contains(event.target)) { 
        setAvDrop(false);
      } 
    };
    const handleDrop1= ()=> {
      setAvDrop(prev => !prev)
    }
    const handleDrop= ()=> {
      setMenuDrop(prev => !prev)
    }

    const handleSearch = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('kword', kword);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`)

    }

  return (
    <div className='w-full z-40 dark:border-b-purple-800 dark:border-b dark:bg-facebookDark-200 flex justify-between items-center p-1 bg-white h-16 shadow-md fixed'>
        <div className='w-fit sm:dark:border max-sm:flex gap-4 items-center sm:dark:border-purple-600 rounded-md'>
            <img onClick={()=> navigate(`/`)} src={assets.deepz} className='w-14 max-zs:w-10 max-zs:h-10 cursor-pointer hover:shadow-glow hover:shadow-purple-400 max-sm:dark:border max-sm:dark:border-purple-600 h-14 rounded-md' alt="" />
            <div onClick={()=> navigate(`/search`)} className='sm:hidden group cursor-pointer p-2 border border-slate-300 rounded transition-all hover:border-purple-500'>
              <FiSearch className='text-lg group-hover:text-gray-700 text-slate-400' /> 
            </div>
        </div>
        <div className=' flex shadow-glow shadow-slate-100 dark:shadow-none items-center max-sm:hidden p-1 dark:bg-slate-600 rounded-md border border-slate-300'>
          <input type="text" name="kword" value={kword} onChange={(e)=> setKword(e.target.value)} className='p-1 dark:bg-slate-600 dark:text-slate-100 outline-none w-full' placeholder='search...' />
          <div className='p-2 rounded-full '>
           <FiSearch onClick={handleSearch} className='text-lg cursor-pointer dark:text-slate-100 text-slate-400' /> 
          </div>
        </div>
        <div className='flex max-md:hidden items-center justify-center gap-3'>
          <Link to={'/'} className='text-facebookDark-800 dark:shadow-purple-500 shadow-glow shadow-slate-200 hover:border hover:border-purple-500 p-1 rounded-md  dark:text-slate-100 text-xl font-semibold'>Home</Link>
          <Link to={'/about'} className='text-facebookDark-800 dark:shadow-purple-500 shadow-glow shadow-slate-200 hover:border hover:border-purple-500 p-1 rounded-md  dark:text-slate-100 text-xl font-semibold'>About</Link>
        </div>
        <div className='flex items-center max-md:hidden justify-center gap-4'>
          <div ref={iconRef1} className='flex relative dark:border dark:border-purple-600 cursor-pointer items-center hover:border-green-700 hover:border dark:shadow-purple-500 shadow-glow shadow-slate-300 rounded-full justify-center'>
            <Avatarz height={40} image={user?.profilePic} width={40}/>
            <IoIosArrowDropdownCircle onClick={handleDrop1} className='absolute  rounded-full hover:animate-pulse dark:text-slate-600 text-purple-700 -bottom-1' />
            {avDrop && <AvatarMenu refy1={dropdownRef1}/>}
          </div>
          {
            user?.id ? 
            <div className='flex gap-3 justify-between items-center'>
              <button onClick={handleLogOut} className='bg-facebookDark-500 dark:border dark:border-purple-600 p-2 text-slate-50 rounded-md flex items-center gap-2 font-semibold'><SlLogout  className='text-white'/> Sign out</button>
            </div> : 
            <div className='flex gap-3 justify-between items-center'>
                <button onClick={()=> navigate('/deep-z-auth')} className='bg-facebookDark-500 p-2 dark:border dark:border-purple-600 text-slate-50 rounded-md font-semibold'>Sign in/Get started</button>
            </div>
          }
        </div>
        
        
        <div className='flex  md:hidden items-center gap-3 justify-center'>
          <Avatarz image={user?.profilePic} height={35} width={35}/>
        
          <div ref={iconRef} className='md:hidden relative items-center justify-center'>
            <FiMenu onClick={handleDrop} className='text-xl dark:text-slate-100 cursor-pointer font-semibold' />
            {menuDrop && <MenuList logout={handleLogOut} refy={dropdownRef}/>}
          </div>
        </div>
    </div>
  )
}

export default Navbar