import { Button, Modal } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { MdDelete, MdEdit } from 'react-icons/md';
import ReactLoading from 'react-loading';
import moment from 'moment'
import Avatarz from '../../Components/Avatarz';
import { toast } from 'react-toastify';

const AllComments = ({toggleView}) => {
  const [allComs, setAllComs] = useState([]);
  const [loady, setLoady] = useState(false);
  const [load, setLoad] = useState(false);
  const [comment, setComment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [more, setMore] = useState(true);
  const [ml, setMl] = useState(false);

   useEffect(()=> {
    getAllcoms();
   }, []);

  const getAllcoms = async () => {
    setLoady(true)
    const { data } = await axios.get(`/api/comments/get-all`);
    if(data.ok) {
      setAllComs(data.comments);
      setLoady(false);
      if(data.comments.length < 9) {
        setMore(false);
      }
    }
  }
  const handleShowMore = async() => {
    setMl(true)
    const startIndex = allComs.length;
    try {
      const { data } = await axios.get(`/api/comments/get-all?startIndex=${startIndex}`);
      if(data.ok) {
        setAllComs(prev =>[...prev, ...data.comments]);
        if(data.comments.length < 9) {
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
  const cancelOpen = ()=> {
    setIsOpen(false);
    setComment(null);
  }
  const deleteComments = async() => {
    setLoad(true)
    const { data } = await axios.delete(`/api/comments/delete-comment/${comment?._id}`);
    if(data.ok) {
      setAllComs(allComs.filter(com=> com?._id !== comment?._id));
      setComment(null);
      toast.success(data?.msg)
      setLoad(false)
      setIsOpen(false)
    }
  }
  return (
    <div className='h-screen w-full dark:bg-facebookDark-200'>
      <div className='flex w-full p-1 items-center'>
        <div className=' sm:hidden'>
          <FaArrowLeft onClick={toggleView} className='dark:text-slate-100'/>
        </div>     
        <p className={`text-2xl dark:text-slate-100 font-bold`}>All Comments <span className='border px-1 font-normal'>{allComs.length}</span></p>
      </div>
      {
        loady && (
          <div className=' w-full h-screen flex justify-center pt-11'>
              <ReactLoading type='bars' color='purple'/>
          </div>
        )
      }
      {
        allComs.length === 0 && !loady && (
          <div className='h-screen flex pt-10 justify-center dark: text-slate-400 w-full'>
            <h2 className='font-semibold text-2xl'>No Comments Found</h2>
          </div>
        )
      }
      {
        allComs.length > 0 && !loady && (
          <div className='w-full max-md:w-screen overflow-y-auto shadow-md scrollbar max-md:overflow-x-scroll p-1'>
            <table className='w-full'>
              <thead className='text-slate-600 shadow-sm max-sm:text-sm dark:bg-slate-500 dark:text-slate-100'>
                <tr className=''>
                  <th>Date</th>
                  <th className=''>User</th>
                  <th>Content</th>
                  <th>Likes</th>
                  <th>Blog ID</th>
                  <th>Delete</th>
                </tr>
                
              </thead>
              <tbody className='w-full dark:bg-slate-600'>
                {
                  allComs.map((cm, i)=> {
                    return(
                      <tr key={i} className='w-full'>
                        <td className='text-center  dark:text-slate-100 max-sm:text-xs p-1'>{moment(cm?.updateAt).format('ll')}</td>
                        <td className='text-center dark:text-slate-100 max-sm:text-xs p-1'><Avatarz height={25} width={25} image={cm?.by?.profileImg} /></td>
                        <td className='text-center dark:text-slate-100 max-sm:text-xs p-1'>{cm?.content}</td>
                        <td className='text-center dark:text-slate-100 max-sm:text-xs p-1'>{cm?.likes.length}</td>
                        <td className=' text-center dark:text-slate-100 max-sm:text-xs p-1'>{cm?.blogId}</td>
                        <td className=' text-center p-1'><Button onClick={()=> { setIsOpen(true); setComment(cm)}}><MdDelete /></Button></td>
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
      <Modal open={isOpen} className='custom-modal' footer={null} onCancel={cancelOpen} >
            <div className='w-full flex items-center justify-center p-3'>
                <h2 className='font-semibold dark:text-slate-100 text-2xl'>Are you sure ?</h2>
            </div>
            <div className='w-full flex items-center justify-center gap-3 p-2'>
                <Button onClick={deleteComments} className='font-semibold bg-red-500 text-slate-100'>Yes</Button>
                <Button onClick={()=> setIsOpen(false)} className='font-semibold  bg-green-500 text-slate-100'>No</Button>
            </div>
      </Modal>
      
    </div>
  )
}

export default AllComments