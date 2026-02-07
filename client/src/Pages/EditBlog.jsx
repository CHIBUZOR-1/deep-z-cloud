import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Components/Layout'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditBlog = () => {
  const [newBlog, setNewBlog] = useState({
      newTitle: '',
      newCat: '',
      newMed: null,
      newI: ''
    });
  const [b, setB] = useState({});
  const [load, setLoad] = useState(false);
    const quillRef = useRef(null);
    const { id } = useParams();
    useEffect(()=> {
      getById();
    }, [])
    const getById = async() => {
      const { data } = await axios.get(`/api/blogs/blog-b/${id}`);
      if(data.success) {
        setB(data?.blog)
        setNewBlog({
          newTitle: data?.blog?.title,
          newCat: data?.blog?.category,
          newI: data?.blog?.descp
        })
      }

    }
    const handleChange = (e)=> {
      setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
    }
    const handleQuillChange = (value) => {
      setNewBlog({ ...newBlog, newI: value });
    };
    const uploadFile = async(e) => {
      const file = e.target.files[0];
      setNewBlog(prev => ({ ...prev, newMed: file}));
    }
    const handlePublish = async() => {
      setLoad(true)
      const formData = new FormData();
      formData.append('newTitle', newBlog.newTitle);
      formData.append('newCat', newBlog.newCat);
      formData.append('newDesc', newBlog.newI);

      if (newBlog.newMed) {
        formData.append('file', newBlog.newMed);
      }
      const { data } = await axios.put(`/api/blogs/edit-blog/${b?._id}`, formData)
      if(data.ok) {
        
        setB(data?.blogz)
        setNewBlog({
          newTitle: data?.blogz?.title,
          newCat: data?.blogz?.category,
          newI: data?.blogz?.descp,
          newMed: null,
        });
      }
      setLoad(false);
    }

  return (
    <Layout>
      <div className='min-h-screen dark:bg-facebookDark-300'>
        <div className='w-full flex items-center p-2 justify-center'>
          <h1 className='font-bold dark:text-slate-50 text-2xl'>Edit blog</h1>
        </div>
        <div className=' w-full flex items-center justify-center p-2'>
          <input name='title' required onChange={handleChange} value={newBlog?.newTitle} placeholder='Title' className='dark:bg-slate-600 sm:w-[70%] max-sm:w-full border font-semibold dark:text-slate-100 outline-none p-2 rounded-md' type="text" />
        </div>
        <div className='w-full flex items-center justify-center p-2'>
          <select value={newBlog?.newCat} onChange={handleChange} required  className='p-2 sm:w-[70%] border max-sm:w-full dark:bg-slate-600 dark:text-slate-100 rounded-md font-semibold dark:border-purple-600' name="newCat" id="">
            <option className='dark:bg-slate-600' value="">Select a category</option>
            <option className='dark:bg-slate-600' value="Sports">Sports</option>
            <option className='dark:bg-slate-600' value="Entertainment">Entertainment</option>
            <option className='dark:bg-slate-600' value="Lifestyle">Lifestyle</option>
            <option className='dark:bg-slate-600' value="Technology">Technology</option>
            <option className='dark:bg-slate-600' value="Food">Food</option>
            <option className='dark:bg-slate-600' value="Finance">Finance</option>
          </select>
        </div>
        <div className='w-full p-2 flex justify-center items-center'>
          <div className='flex w-[70%] max-sm:w-full rounded-md  border-purple-600 border-dotted border-[2px] items-center p-1 justify-between'>
            <input required  onChange={uploadFile} name='media' className='bg-purple-900 cursor-pointer text-white font-semibold rounded-md' type="file" accept='image/*' />
          </div>
        </div>
        <div className='w-full p-2 flex items-center justify-center'>
          <div className='sm:w-[50%] bg-black rounded-md relative max-sm:w-full h-[500px] '>
            <img className='w-full rounded-md shadow-lg h-full inset-0 absolute object-cover max-sm:object-cover' src={newBlog?.newMed? URL.createObjectURL(newBlog?.newMed) : b?.media} alt='' />
          </div>
        </div>
          
        <div  className='w-full flex h-52 max-sm:h-60  justify-center p-2'>
          <ReactQuill ref={quillRef} theme="snow" className='w-[70%] max-sm:w-full h-36 dark:text-slate-100' value={newBlog?.newI} onChange={handleQuillChange} />
        </div>
        <div className='w-full flex items-center justify-center p-2'>
          <button onClick={handlePublish} className={`w-[70%] max-sm:text-sm max-sm: p-2 bg-facebookDark-300 border ${load && 'animate-pulse'} border-purple-600 active:bg-purple-700 text-white font-semibold rounded-md`}>{load? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Layout>
  )
}

export default EditBlog