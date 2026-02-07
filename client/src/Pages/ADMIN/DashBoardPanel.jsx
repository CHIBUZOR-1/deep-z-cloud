import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaComments } from 'react-icons/fa'
import axios from 'axios';
import ReactLoading from 'react-loading';
import { HiArrowNarrowUp, HiUsers } from "react-icons/hi";
import { TbLogs } from "react-icons/tb";
import { Button } from 'antd';
import Avatarz from '../../Components/Avatarz';
import { useNavigate } from 'react-router-dom';


const DashBoardPanel = ({toggleView}) => {
   const [allUsers, setAllUsers] = useState([]);
   const [tu, setTu] = useState('');
   const [lmu, setLmu] = useState('');
   const [allBlogz, setAllBlogz] = useState([]);
   const [tb, setTb] = useState('');
   const [lmb, setLmb] = useState('');
   const [allComments, setAllComments] = useState([]);
   const [tc, setTc] = useState('');
   const [lmc, setLmc] = useState('');
   const [bload, setBload] = useState(false);
   const [uload, setUload] = useState(false);
   const [cload, setCload] = useState(false);
   const navigate = useNavigate();

   useEffect(()=> {
    getAllUsers();
    getAllComments();
    getAllBlogs();
   }, [])

   const getAllUsers = async()=> {
    setUload(true);
    const { data } = await axios.get(`/api/users/all-users`);
    if(data?.success) {
      setAllUsers(data.users)
      setTu(data.totalUsers)
      setLmu(data.lastMonthUsers)
      setUload(false);
    }
  }
  const getAllBlogs = async()=> {
    setBload(true)
    const { data } = await axios.get(`/api/blogs/all-blogs?limit=5`);
    if(data.success) {
      setAllBlogz(data?.blogs);
      setTb(data.totalBlogs);
      setLmb(data.lastMonthBlogs)
      setBload(false)
    }
  }
  const getAllComments = async()=> {
    setCload(true)
    const { data } = await axios.get(`/api/comments/get-all`);
    if(data.ok) {
      setAllComments(data.comments)
      setTc(data.totalComments);
      setLmc(data.lastMonthComments)
      setCload(false)
    }
  }

  return (
    <div className='dark:bg-facebookDark-200 overflow-y-auto scrollbar flex flex-col gap-1 p-1 h-screen'>
      <button onClick={toggleView} className='dark:text-white text-slate-700 sm:hidden'><FaArrowLeft/></button>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 justify-center'>
        <div className='w-full border dark:border-slate-400 rounded-md p-1 shadow-lg'>
          {
            uload  && (
              <div className='w-full h-28 flex pt-4 justify-center'>
                <ReactLoading type='bars' height={20} width={50} color='purple'/>
              </div>
              
            )
          }
          {
            allUsers.length === 0 && !uload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL USERS</p>
                  <HiUsers className='text-blue-600' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tu}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-500 text-xs dark:text-green-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmu}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
          }
          {
            allUsers.length > 0 && !uload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL USERS</p>
                  <HiUsers className='text-blue-600' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tu}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-500 text-xs dark:text-green-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmu}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
          }
          
        </div>
        <div className='w-full p-1 rounded-md border dark:border-slate-400 shadow-lg'>
          {
            bload  && (
              <div className='w-full h-28 flex pt-4 justify-center'>
                <ReactLoading type='bars' height={20} width={50} color='purple'/>
              </div>
            )
          }
          {
            allBlogz.length === 0 && !bload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL BLOGS</p>
                  <TbLogs className='text-green-600 dark:text-purple-400' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tb}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-500 text-xs dark:text-green-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmb}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
              
          }
          {
            allBlogz.length > 0 && !bload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL BLOGS</p>
                  <TbLogs className='text-green-600 dark:text-purple-400' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tb}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-500 text-xs dark:text-green-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmb}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
              
          }
        </div>
        <div className='w-full rounded-md border dark:border-slate-400 shadow-lg p-1'>
          {
            cload  && (
              <div className='w-full h-28 pt-4 flex justify-center'>
                <ReactLoading type='bars' height={20} width={50} color='purple'/>
              </div>
            )
          }
          {
            allComments.length === 0 && !cload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL COMMENTS</p>
                  <FaComments className='text-purple-700 dark:text-purple-400' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tc}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-500 text-xs dark:text-green-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmc}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
              
          }
          {
            allComments.length > 0 && !cload && (
              <>
                <div className='flex w-full items-center justify-between'>
                  <p className='dark:text-slate-100 font-semibold'>TOTAL COMMENTS</p>
                  <FaComments className='text-purple-700 dark:text-purple-400' />
                </div>
                <div className='w-full flex items-center justify-start pr-1'>
                  <p className='font-semibold dark:text-slate-100'>{tc}</p>
                </div>
                <div className='flex gap-2 w-full items-center justify-start'>
                  <div className='flex items-center justify-start'>
                    <HiArrowNarrowUp className='text-green-600 text-xs dark:text-purple-400'/>
                    <p className='text-xs dark:text-slate-100 font-semibold'>{lmc}</p>
                  </div>
                  
                  <p className='font-semibold dark:text-slate-100'>Last update</p>
                </div>
              </>
            )
              
          }
        </div>
      </div>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        <div className='w-full border rounded-md dark:border-slate-400'>
          <div className='w-full flex items-center p-2 justify-between'>
            <p className='font-semibold dark:text-slate-100'>Recent Users</p>
            <Button onClick={()=>navigate('/dashboard?view=all-users')} className='font-semibold'>See all</Button>
          </div>
          <div className='w-full h-60 overflow-y-auto scrollbar'>
            <table className='w-full p-2'>
              <thead className='w-full dark:bg-slate-600'>
                <tr>
                  <th  className='dark:text-slate-100 font-semibold'>Image</th>
                  <th className='dark:text-slate-100 font-semibold'>Username</th>
                </tr>
              </thead>
              <tbody>
                {
                  allUsers.map((us, i)=> {
                    return(
                      <tr key={i}>
                        <td className='flex justify-center items-center'><Avatarz height={40} width={40} image={us?.profileImg}/></td>
                        <td className='dark:text-slate-100 text-center'>{us?.username}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className='w-full border rounded-md dark:border-slate-400'>
          <div className='w-full flex items-center p-2 justify-between'>
            <p className='font-semibold dark:text-slate-100'>Recent Comments</p>
            <Button onClick={()=>navigate('/dashboard?view=all-comments')} className='font-semibold'>See all</Button>
          </div>
          <div className='w-full h-60 overflow-y-auto scrollbar'>
            <table className='w-full p-2'>
              <thead className='w-full dark:bg-slate-600'>
                <tr>
                  <th  className='dark:text-slate-100 font-semibold'>Content</th>
                  <th className='dark:text-slate-100 font-semibold'>Likes</th>
                </tr>
              </thead>
              <tbody>
                {
                  allComments.map((co, i)=> {
                    return(
                      <tr key={i}>
                        <td className='dark:text-slate-100 text-center'>{co?.content}</td>
                        <td className='dark:text-slate-100 text-center'>{co?.likes.length}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      <div className='w-full flex items-center p-1'>
        <div className='w-full border rounded-md dark:border-slate-400'>
          <div className='w-full flex items-center p-2 justify-between'>
            <p className='font-semibold dark:text-slate-100'>Recent Blogs</p>
            <Button onClick={()=>navigate('/dashboard?view=all-blogs')} className='font-semibold'>See all</Button>
          </div>
          <table className='w-full p-2'>
            <thead className='w-full dark:bg-slate-600'>
              <tr>
                <th  className='dark:text-slate-100 font-semibold'>Image</th>
                <th className='dark:text-slate-100 font-semibold'>Title</th>
                <th className='dark:text-slate-100 font-semibold'>Category</th>
              </tr>
            </thead>
            <tbody>
              {
                allBlogz.map((bl, i)=> {
                  return(
                    <tr key={i}>
                      <td className='dark:text-slate-100 flex items-center justify-center p-1'><img src={bl?.media} className='h-10 w-14 inset-0 object-cover' alt={bl?.media} /></td>
                      <td className='dark:text-slate-100 text-center p-1'>{bl?.title}</td>
                      <td className='dark:text-slate-100 text-center p-1'>{bl?.category}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashBoardPanel