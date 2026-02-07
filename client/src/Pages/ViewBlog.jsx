import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'
import CommentsSection from '../Components/CommentsSection';

const ViewBlog = () => {
  const [view, setView] = useState({})
  const { id } = useParams();
    useEffect(()=> {
      getById();
    }, [id])
    const getById = async() => {
      const { data } = await axios.get(`/api/blogs/blog-b/${id}`);
      if(data.success) {
        setView(data.blog);
      }

    }
  return (
    <Layout>
      <div className=' w-full dark:bg-facebookDark-200'>
        <div className='w-full flex items-center p-2 justify-center'>
          <h1 className='font-bold text-center dark:text-slate-100 text-2xl'>{view?.title}</h1>
        </div>
        <div className='w-full p-1 flex items-center justify-center'>
          <Link className=''>
              <button className='p-2 rounded-md hover:text-slate-700 font-semibold border dark:text-slate-100 border-slate-400 hover:bg-orange-300'>{view?.category}</button>
          </Link>
        </div>
        <div className='w-full flex justify-center items-center p-1'>
          <img src={view?.media} alt={view?.media} className='p-2 max-md:w-[90%] max-h-[500px] w-[60%] max-md:object-cover inset-0 object-fill' />
        </div>
        <div className=' w-full flex justify-center items-center'>
          <div className='w-[60%] max-md:w-[90%] p-2 flex justify-between shadow-md items-center'>
            <p className='dark:text-slate-100 font-semibold'>{moment(view?.createdAt).format('ll')}</p>
            <p className='dark:text-slate-100 font-semibold'>{(view?.descp?.length / 1000).toFixed(0)} min read</p>
          </div>
        </div>
        <div className='w-full flex items-center justify-center'>
          <div className='w-[60%] max-md:w-[90%] p-1 shadow-md'>
            <div className='dark:text-slate-100 tip font-semibold' dangerouslySetInnerHTML={{__html: view.descp}} />
          </div>
        </div>
        <div className='w-full flex items-center justify-center'>
          <CommentsSection bId={view?._id}/>
        </div>
        
      </div>
    </Layout>
    
  )
}

export default ViewBlog