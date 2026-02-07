import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(state=> state?.user?.user);
  console.log(location)
  const [dataz, setDataz] = useState({
    kword: '',
    sort: 'desc',
    caty: ''
  });
  const [blogs, setBlogs] = useState([]);
  const [load, setLoad] = useState(false);
  const [more, setMore] = useState(true)

  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('kword');
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('caty');
    if(searchFromUrl || sortFromUrl || categoryFromUrl) {
      setDataz({
        ...dataz,
        kword: searchFromUrl,
        sort: sortFromUrl,
        caty: categoryFromUrl
      });
    }
    const getAllBlogs = async()=> {
      setLoad(true)
      const searchQuery = urlParams.toString();
      const { data } = await axios.get(`/api/blogs/all-blogs?${searchQuery}`);
      if(data.success) {
        setBlogs(data?.blogs);
        setLoad(false)
        if(data?.blogs.length < 9) {
          setMore(false)
        }
      }
      if(!data.success) {
        setLoad(false);
        return;
      }
    }
    getAllBlogs();
  }, [location.search]);

  const handleChange= (e)=> {
    if(e.target.name === 'kword') {
      setDataz({
        ...dataz, kword: e.target.value
      });
    }
    if(e.target.name === 'sort') {
      const order = e.target.value || 'desc';
      setDataz({
        ...dataz, sort: order
      });
    }
    if(e.target.name === 'caty') {
      const category = e.target.value || '';
      setDataz({
        ...dataz, caty: category
      });
    }
  }

  const useFilter = ()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('kword');
    urlParams.set('kword', searchFromUrl || '' );
    urlParams.set('sort', dataz.sort);
    urlParams.set('caty', dataz.caty);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  const handleShowMore = async() => {
    const nBlogs = blogs.length;
    const startIndex = nBlogs;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const { data } = await axios.get(`/api/blogs/all-blogs?${searchQuery}`);
      if(data.success) {
        setBlogs(prev =>[...prev, ...data.blogs]);
        if(data?.blogs.length < 9) {
          setMore(false)
        }
      }
      if(!data.success) {
        return;
      }
  }

  return (
    <Layout>
      <div className='flex max-sm:overflow-y-auto scrollbar dark:bg-facebookDark-300 max-sm:flex-col h-screen mt-0 top-0'>
        <div className={` bg-white dark:bg-facebookDark-600 w-full max-w-[150px] max-sm:max-w-full max-sm:px-2 border border-t-0 h-full`}>
            <aside className='flex sm:flex-col p-2 max-sm:items-center  max-sm:w-full gap-4'>
              <div className='w-full p-1'>
                <p className='font-semibold dark:text-slate-100'>Sort:</p>
                <select value={dataz.sort} name='sort' onChange={handleChange}  className='w-full p-1 border outline-none dark:bg-slate-600 dark:text-slate-100 border-slate-300 rounded-md' >
                  <option className='dark:bg-slate-600 dark:text-slate-100' value="desc">Latest</option>
                  <option className='dark:bg-slate-600 dark:text-slate-100' value="asc">Oldest</option>
                </select>
              </div>
              <div className='w-full p-1'>
                <p className='font-semibold dark:text-slate-100'>categories:</p>
                <select value={dataz.caty} name='caty' onChange={handleChange}  className='w-full border p-1 outline-none dark:bg-slate-600 dark:text-slate-100 border-slate-300 rounded-md' >
                <option className='dark:bg-slate-600 dark:text-slate-100' value="">none</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Sports">Sports</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Entertainment">Entertainment</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Lifestyle">Lifestyle</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Technology">Technology</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Food">Food</option>
                <option className='dark:bg-slate-600 dark:text-slate-100' value="Finance">Finance</option>
                </select>
              </div>
              <div className='w-full max-sm:hidden p-1'>
                <button onClick={useFilter} className='w-full p-1 border rounded-md bg-blue-700 text-slate-100 font-semibold active:bg-orange-400'>Apply</button>
              </div>
            </aside>
            <div className='w-full sm:hidden p-1'>
                <button onClick={useFilter} className='w-full p-1 border rounded-md bg-blue-700 text-slate-100 font-semibold active:bg-orange-400'>Apply</button>
              </div>
          </div>
          <div className='w-full sm:h-screen sm:overflow-y-auto'>
            <div className='w-full p-1'>
              <p className={`text-2xl ${blogs.length === 0 && 'hidden'} dark:text-slate-100 font-bold`}>Blog results <span className='font-normal border px-2'>{blogs.length}</span></p>
            </div>
            {
              load && (
                <div className=' w-full h-screen flex justify-center pt-11'>
                  <ReactLoading type='bars' color='purple'/>
                </div>
              )
            }
            {
              blogs.length === 0 && !load && (
                <div className='h-screen flex pt-10 justify-center dark: text-slate-400 w-full'>
                  <h2 className='font-semibold text-2xl'>No Results Found</h2>
                </div>
              )
            }
            {
              blogs.length > 0 && !load && (
                <div className='p-3 w-full gap-3 grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3'>
                  {
                    blogs.map((bg, i)=> {
                      return(
                        <div key={i} className='w-full border border-slate-300 shadow-md relative h-[340px] overflow-hidden dark:bg-slate-700 rounded-md group'>
                          <div onClick={()=> navigate(user?.id ? `/vw-b/${bg?._id}` : '/deep-z-auth')} className='p-1 max-sm:w-full'>
                            <img src={bg?.media} alt="" className='h-[260px] z-30 group-hover:h-52 w-full transition-all duration-300' />
                          </div>
                          <div className='p-3 flex flex-col gap-1'>
                            <p className='text-lg font-semibold line-clamp-2 dark:text-slate-100 '>{bg?.title}</p>
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
            {
              more && (
                <button onClick={handleShowMore} className='dark:text-slate-100 text-blue-600 dark:hover:text-blue-500 p-1'>Show more</button>
              )
            }
          </div>
      </div>
    </Layout>
  )
}

export default Search