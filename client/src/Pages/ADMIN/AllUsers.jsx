import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import Avatarz from '../../Components/Avatarz';
import { MdEdit } from "react-icons/md";
import { Button, Modal } from 'antd';
import { MdDelete } from "react-icons/md";
import ReactLoading from 'react-loading';
import { GoVerified } from "react-icons/go";
import { TbEyeCancel } from "react-icons/tb";
import { toast } from 'react-toastify';




const AllUsers = ({toggleView}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [newRole, setNewRole] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [load, setLoad] = useState(false)
  const [user, setUser] = useState(null);
  const [more, setMore] = useState(true);
  const [ml, setMl] = useState(false);

  useEffect(()=> {
    getAll();
  }, [])
  

  const getAll = async()=> {
    setLoading(true);
    const { data } = await axios.get(`/api/users/all-users`);
    if(data?.success) {
      setAllUsers(data.users)
      setLoading(false);
      if(data.users.length < 9) {
        setMore(false);
      }
    }
  }
  const handleShowMore = async() => {
    setMl(true)
    const startIndex = allUsers.length;
    try {
      const { data } = await axios.get(`/api/users/all-users?startIndex=${startIndex}`);
      if(data.success) {
        setAllUsers(prev =>[...prev, ...data.users]);
        if(data.users.length < 9) {
          setMore(false);
        }
        setMl(false)
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
        setLoad(false);
    }
  }

  const cancelM = () => {
    setIsOpen(false)
    setUser(null)
  }
  const cancelM1 = () => {
    setVisible(false)
    setUser(null)
  }

  const changeUserRole = async (e) => {
    e.preventDefault()
    setLoad(true)
    const {data} = await axios.put(`/api/users/update_role/${user._id}`, { newRole });
    if(data?.ok) {
      toast.success(data.message)
      setUser(null);
      setNewRole("");
      setVisible(false);
      setAllUsers(allUsers.map(userz => (userz._id === data?.roleUpdated._id ? data?.roleUpdated : userz)));
      setLoad(false);
    }
  }

  const handleDeleteUser = async() => {
    const { data } = await axios.delete(`/api/users/delete-user/${user._id}`);
    if(data.ok) {
      setAllUsers(allUsers.filter(users => users._id !== user?._id))
      setUser(null);
      setIsOpen(false);
    }
  }

  return (
    <div className='p-1 dark:bg-facebookDark-300 h-screen flex flex-col gap-1 items-center w-full'>
      <div className='flex w-full p-1 items-center'>
        <div className=' sm:hidden'>
          <FaArrowLeft onClick={toggleView} className='dark:text-slate-100'/>
        </div>
        <p className={`text-2xl ${allUsers.length === 0 && 'hidden'} dark:text-slate-100 font-bold`}>All users <span className='font-normal border px-2'>{allUsers.length}</span></p>
      </div>
      {
        loading && (
          <div className=' w-full h-screen flex justify-center pt-11'>
            <ReactLoading type='bars' color='purple'/>
          </div>
        )
      }
      {
        allUsers.length === 0 && !loading && (
          <div className='h-screen flex pt-10 justify-center dark: text-slate-400 w-full'>
            <h2 className='font-semibold text-2xl'>No Users Found</h2>
          </div>
        )
      }
      {
        allUsers.length > 0 && !loading && (
          <div className='w-full overflow-y-auto shadow-md scrollbar max-md:overflow-x-scroll p-1'>
            <table className='w-full'>
              <thead className='text-slate-600 max-sm:text-sm shadow-sm dark:bg-slate-500 dark:text-slate-100'>
                <tr className=''>
                  <th className=''>Image</th>
                  <th className='text-center p-1'>Username</th>
                  <th className='text-center p-1'>Email</th>
                  <th className='text-center p-1'>Admin</th>
                  <th className='text-center p-1'>Edit</th>
                  <th className='text-center p-1'>Delete</th>
                </tr>
                
              </thead>
              <tbody className='w-full dark:bg-slate-600'>
                {
                  allUsers.map((us, i)=> {
                    return(
                      <tr key={i} className='w-full'>
                        <td className='flex items-center justify-center p-1'><Avatarz height={50} width={50} image={us?.profileImg}/></td>
                        <td className='text-center max-sm:text-xs dark:text-slate-100 p-1'>{us?.username}</td>
                        <td className='text-center max-sm:text-xs dark:text-slate-100 p-1'>{us?.email}</td>
                        <td className=' text-center  dark:text-slate-100 p-1'>{us.isAdmin? <span className='flex text-green-400 items-center justify-center'><GoVerified /></span> : <span className='flex text-red-400 items-center justify-center'><TbEyeCancel /></span>}</td>
                        <td className=' text-center max-sm:text-xs p-1'><Button onClick={()=> { setVisible(true); setUser(us); setNewRole(us.isAdmin)}}><MdEdit /></Button></td>
                        <td className=' text-center max-sm:text-xs p-1'><Button onClick={()=> { setIsOpen(true); setUser(us)}}><MdDelete /></Button></td>
                      </tr>
                    )
                    
                  })
                }
              </tbody>
            </table>
          </div>
        )
      }
      {
              more && (
                <div className='w-full p-1 flex items-center justify-center'>
                  <button onClick={handleShowMore} className='dark:text-slate-100 gap-2 font-medium text-blue-600 flex items-center dark:hover:text-blue-500 p-1'>Show more {ml && <ReactLoading type='spin' height={10} width={10} color='blue'/>}</button>
                </div>
                
              )
      }

      <Modal open={isOpen} className='custom-modal' footer={null} onCancel={cancelM} >
            <div className='w-full flex items-center justify-center p-3'>
                <h2 className='font-semibold dark:text-slate-100 text-2xl'>Are you sure ?</h2>
            </div>
            <div className='w-full flex items-center justify-center gap-3 p-2'>
                <Button onClick={handleDeleteUser} className='font-semibold bg-red-500 text-slate-100'>Yes</Button>
                <Button onClick={()=> setIsOpen(false)} className='font-semibold  bg-green-500 text-slate-100'>No</Button>
            </div>
      </Modal>
      <Modal open={isVisible} className='custom-modal' footer={null} onCancel={cancelM1} >
            <div className='w-full flex items-center justify-center p-3'>
              <form className='gap-7' onSubmit={changeUserRole}>
                  <div className='flex gap-2'>
                    <p className='font-bold dark:text-slate-100'>Role:</p>
                      <select value={newRole} className='border rounded w-[110px] border-slate-300' onChange={(e)=> setNewRole(e.target.value)} name='newRole'>
                          <option value={'true'}>ADMIN</option>
                          <option value={'false'}>GENERAL</option>
                      </select>
                  </div>
                  <button type='submit' className='bg-slate-500 font-bold text-white mt-4 border border-slate-200 rounded items-center flex justify-center w-[110px]'>{load? 'UPDATING...':'UPDATE'}</button>
              </form>
            </div>
      </Modal>
      
      
    </div>
  )
}

export default AllUsers