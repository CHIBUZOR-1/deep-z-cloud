import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Avatarz from './Avatarz';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { calculateTime } from '../ClientUtils/CalculateMoment';
import { IoIosThumbsUp } from "react-icons/io";
import { Button, Modal } from 'antd';
import ReactLoading from 'react-loading';



const CommentsSection = ({ bId }) => {
    const user = useSelector(state=> state?.user?.user);
    const [comt, setComt] = useState('');
    const [coms, setComs] = useState([]);
    const [eComt, setEcomt] = useState('')
    const [isEditing, setIsEditing] = useState(null);
    const [isOpen, setIsOpen] = useState(false)
    const [dId, setDid] = useState('')
    const [load, setLoad] = useState(false);

    useEffect(()=> {
        getBlogComments();
    }, [bId])

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoad(true)
        const { data } = await axios.post(`/api/comments/create-comment`, {comt, bId});
        if(data.ok) {
            setComt('')
            setComs(prevComs=> [data?.popComment, ...prevComs])
            setLoad(false)
        }
    }

    const toggleEdit = (cd)=> {
        setIsEditing(prev => prev === cd ? null : cd)
    }

    const cancelEdit = () => {
        setIsEditing(null)
        setEcomt('')
    }

    const modalClose = ()=> {
        setIsOpen(false);
    }

    const getBlogComments = async() => {
        const { data } = await axios.get(`/api/comments/getComments/${bId}`);
        if(data.ok) {
            setComs(data?.comment)
        }
    }
    const likeUnlike = async(cId) => {
        const { data } = await axios.post(`/api/comments/like/${cId._id}`);
        if(data?.ok) {
            setComs(coms.map(com => (com._id === data?.updatedComment._id ? data?.updatedComment : com)));
        }
    }

    const handleEdit = async (cId) => {
        const { data } = await axios.put(`/api/comments/edit-comment/${cId}`, { eComt });
        if(data?.ok) {
            setEcomt('');
            setIsEditing(null);
            setComs(coms.map(com => (com._id === data.updatedCommentz._id ? data.updatedCommentz : com)));
        }
    }

    const deleteComment = async()=> {
        const { data } = await axios.delete(`/api/comments/delete-comment/${dId?._id}`);
        if(data.ok) {
            setComs(coms.filter(com => com?._id !== dId?._id));
            setIsOpen(false)
            setDid(null)
        }
    }
    
  return (
    <div className='w-full shadow-md flex flex-col p-1 items-center justify-center'>
        {
            user? (
                <div className='flex max-md:w-[90%] w-[60%] gap-1 p-1 items-center justify-start'>
                    <p className=' text-sm dark:text-slate-100 max-zs:text-[9px] font-semibold'>Signed In as:</p>
                    <Avatarz image={user?.profilePic} height={20} width={20}/>
                    <Link to={'/dashboard?view=admin-profile'}>
                        <p className='text-sm font-semibold max-zs:text-xs hover:underline text-blue-400'>@{user?.username}</p>
                    </Link>
                </div>
            ) : (
                <div className='flex max-md:w-[90%] w-[60%] gap-1 p-1 items-center justify-start'>
                    <p className=' text-sm dark:text-slate-100 font-semibold'>You must be signed in to comment.</p>
                    <Link>
                        Sign in
                    </Link>
                </div>
            )
        }
        {/* Add Comment Form if logged in */}
        {
            user && (
                <div className=' max-md:w-[90%] flex items-center justify-center w-[60%]'>
                    <form onSubmit={handleSubmit}  className='p-1 border rounded-md w-full'>
                        <textarea required value={comt} onChange={(e)=> setComt(e.target.value)} placeholder='Add comment...' maxLength={200}  className='rounded border outline-none w-full font-semibold p-1' name="comt" rows={3} id=""/>
                        <div className='w-full flex items-center justify-between p-1'>
                            <p className=' max-md:text-xs font-semibold dark:text-slate-100'>{200 - comt.length} characters remaining</p>
                            <button type='submit' disabled={comt.length > 200} className='font-semibold hover:bg-purple-700 max-zs:text-xs hover:text-slate-100 p-2 rounded-md border flex items-center border-purple-600 bg-white active:text-orange-400'>{load ? <span className='flex items-center justify-center'><ReactLoading type='bars' height={30} width={30} color='white'/></span> :'Submit'}</button>
                        </div>
                    </form>  
                </div>
                
            )
        }
        {/* If no Comments */}
        {
            coms.length === 0 && (
                <p className='text-sm font-semibold text-slate-400'>No comments yet</p>
            )
        }
        {/* If Article has comments */}
        {
            coms.length > 0 && (
                <div className='w-[60%] space-y-2 max-md:w-[90%] p-1'>
                    <div className='flex justify-start items-center gap-1'>
                      <p className='font-semibold dark:text-slate-100'>Comments</p>
                      <p className='font-semibold dark:text-slate-100 border px-1'>{coms.length}</p>  
                    </div>
                    {
                        coms?.map((cm, i) => {
                            return(
                                <div key={i} className='w-full shadow-md flex p-1 items-center'>
                                    <div className='flex gap-1 w-full'>
                                        <Avatarz image={cm?.by?.profileImg} height={30} width={30}/>
                                        <div className='flex flex-col justify-center w-full '>
                                            <div className='flex gap-1 items-center'>
                                                <p className='text-xs dark:text-slate-100 font-semibold'>@{cm?.by?.username}</p>
                                                <p className='text-xs dark:text-slate-100'>{calculateTime(cm?.updatedAt)}</p>
                                            </div>
                                            {
                                                // iF editing comment
                                                isEditing === cm._id ? (
                                                    <div  className='p-1 border rounded-md w-full'>
                                                        <textarea required value={eComt} onChange={(e)=> setEcomt(e.target.value)} placeholder='Add comment...' maxLength={200}  className='rounded border outline-none w-full font-semibold p-1' name="eComt" rows={3} id=""/>
                                                        <div className='w-full flex items-center justify-between p-1'>
                                                            <p className=' max-md:text-xs max-sm:hidden font-semibold dark:text-slate-100'>{200 - comt.length} characters remaining</p>
                                                            <div className='flex items-center justify-center gap-2'>
                                                              <button onClick={()=>handleEdit(cm._id)} disabled={comt.length > 200} className={`font-semibold ${comt.length > 200 && 'text-slate-300'} p-2 max-sm:text-sm hover:bg-purple-700 hover:text-slate-100 rounded-md border border-purple-600 bg-white active:text-orange-400`}>Save</button>  
                                                              <button  onClick={cancelEdit} className='font-semibold p-2 rounded-md border border-purple-600 bg-white max-sm:text-sm hover:bg-purple-700 hover:text-slate-100 active:text-orange-400'>Cancel</button> 
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* This is For  comment */}
                                                        <div>
                                                            <p className='p-1 dark:text-slate-100 max-sm:text-sm'>{cm?.content}</p>
                                                        </div>
                                                        <div className='flex cl gap-1 items-center'>
                                                            <button onClick={()=> likeUnlike(cm)} className='flex gap-1 items-center'>
                                                                <IoIosThumbsUp className={`${cm.likes.includes(user?.id) ? 'text-blue-500' : 'dark:text-slate-400'} cursor-pointer`}/>
                                                                {
                                                                    cm?.likes.length > 0 && (
                                                                        <p className='p-1 dark:text-slate-100 text-xs'>{cm?.likes.length} {cm?.likes.length === 1? "like" : "likes"}</p>
                                                                    )
                                                                }
                                                            </button>
                                                            {
                                                                (user.id === cm?.by?._id || user?.admin) && (
                                                                    <>
                                                                        <p onClick={()=> { toggleEdit(cm._id); setEcomt(cm.content)}} className='text-xs active:text-blue-500 cursor-pointer dark:text-slate-100'>Edit</p>
                                                                        <p onClick={()=>{setIsOpen(true) ; setDid(cm)}} className='text-xs active:text-blue-500 cursor-pointer dark:text-slate-100'>Delete</p>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                    
                                                )
                                            }
                                        </div>
                                        
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
            )
        }
        <Modal open={isOpen} className='custom-modal' footer={null} onCancel={modalClose}>
            <div className='w-full flex items-center justify-center p-3'>
                <h2 className='font-semibold dark:text-slate-100 text-2xl'>Are you sure ?</h2>
            </div>
            <div className='w-full flex items-center justify-center gap-3 p-2'>
                <Button onClick={deleteComment} className='font-semibold bg-red-500 text-slate-100'>Yes</Button>
                <Button onClick={()=> setIsOpen(false)} className='font-semibold  bg-green-500 text-slate-100'>No</Button>
            </div>
        </Modal>
    </div>
  )
}

export default CommentsSection