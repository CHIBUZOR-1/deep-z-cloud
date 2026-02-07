import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import { useSelector } from 'react-redux';
import { assets } from '../assets/assets';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

const Homepage = () => {
  const user = useSelector(state=> state?.user?.user);
  const [allBlogz, setAllBlogz] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
      getAllBlogs();
    }, []);
  const getAllBlogs = async()=> {
    setLoad(true)
    const { data } = await axios.get(`/api/blogs/all-blogs?limit=6`);
    if(data.success) {
      setAllBlogz(data?.blogs);
      setLoad(false)
    }
  }
  return (
    <Layout>
      <div className=' dark:bg-facebookDark-200 min-h-screen w-full dark:text-slate-100'>
        <div className='w-full shadow-glow shadow-slate-300 sm:bg-slate-100 p-1 flex gap-2'>
          <div className='w-[60%] max-sm:w-full flex gap-2 flex-col max-sm:items-center justify-center p-1'>
            <h2 className='text-4xl max-zs:text-xl dark:text-slate-300 max-sm:text-2xl sm:dark:text-slate-600 font-bold text-slate-600'>Welcome to <span className=' italic dark:text-purple-500 animate-pulse'>Deep-Z</span> Blog</h2>
            <p className='text-xl max-zs:text-xs dark:text-slate-300 max-sm:text-sm font-medium sm:dark:text-slate-500 italic text-slate-600'>A place to read and deepen your understanding from various articles of unique interest.</p>
            <div className='flex p-1'>
              <button className='p-2 max-sm:text-sm font-semibold bg-slate-600 text-slate-100 rounded-md'>View articles</button>
            </div>
          </div>
          <div className='w-[40%] max-sm:hidden'>
            <img src={assets.deepz} className='w-full' alt="" />
          </div>
        </div>
        <div className='w-full p-2 flex flex-col'>
          <div className='w-full flex items-center justify-center rounded-md'>
            <p className='font-semibold p-1 border'>Recent articles</p>
          </div>
          <div>
            {
              load && (
                <div className=' w-full h-screen flex justify-center pt-11'>
                  <ReactLoading type='bars' color='purple'/>
                </div>
              )
            }
            {
              allBlogz.length === 0 && !load && (
                <div className='h-screen flex pt-10 justify-center dark: text-slate-400 w-full'>
                  <h2 className='font-semibold text-2xl'>No blogs Found!</h2>
                </div>
              )
            }
            {
              allBlogz.length > 0 && !load && (
                <div className='p-3 w-full gap-3 grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3'>
                  {
                    allBlogz.map((bg, i)=> {
                      return(
                        <div key={i} className='w-full border border-slate-300 shadow-md relative h-[340px] overflow-hidden dark:bg-slate-700 rounded-md group'>
                          <div onClick={()=> navigate(user?.id ? `/vw-b/${bg?._id}` : '/deep-z-auth')} className='p-1 max-sm:w-full'>
                            <img src={bg?.media} alt="" className='h-[260px] z-30 group-hover:h-52 w-full transition-all duration-300' />
                          </div>
                          <div className='p-3 flex flex-col gap-1'>
                            <p className='text-lg font-semibold line-clamp-2 dark:text-slate-100'>{bg?.title}</p>
                            <span className='italic text-sm dark:text-slate-100'>{bg?.category}</span>
                            <Link to={user?.id ? `/vw-b/${bg?._id}` : '/deep-z-auth'} className='z-10 border transition-all duration-300 bg-slate-700 dark:bg-purple-700 font-semibold text-slate-100 rounded-md text-center py-1 group-hover:bottom-0 left-0 right-0 absolute bottom-[-200px]'>
                              Read article
                            </Link>
                          </div>
                        </div>
                      )
                      
                    })
                  }
                </div>
              )
            }
          </div>
        </div>
        
      </div>
    </Layout>
  )
}

export default Homepage