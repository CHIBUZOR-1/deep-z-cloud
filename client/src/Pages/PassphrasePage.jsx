import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import axios from 'axios';

const PassphrasePage = () => {
    const navigate = useNavigate();
    const [dataz, setDataz] = useState({
            email: "",
            passPhrase: "",
    });
    const [load, setLoad] = useState(false);
    const handleChange = (e)=> {
        setDataz({ ...dataz, [e.target.name]: e.target.value });

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true)
        const {data} =await axios.post(`/api/users/new-ph`, dataz)
        if(data.ok) {
            toast.success(data.msg);
            setDataz({
                email: "",
                passPhrase: "",
            })
            setLoad(false);
            navigate('/reset-password'); 
        }
      
        if(!data.ok) {
            toast.error(data.msg);
            setLoad(false);
        }
    }
  return (
    <div className='h-screen w-full dark:bg-facebookDark-300 flex justify-center items-center'>
        <div className=' border border-purple-500 w-[80%] p-1 py-2 flex flex-col gap-2 items-center justify-center'>
                <h2 className='dark:text-slate-100 font-semibold text-2xl'>Create New Passphrase</h2>
                <form className='dark:bg-facebookDark-300 space-y-2' onSubmit={handleSubmit}>
                    <input name='email' value={dataz?.email} onChange={handleChange}  type="text" className='w-full p-2 dark:bg-slate-500 dark:text-slate-100 font-medium outline-none border-slate-300 rounded-md' placeholder='Email...' />
                    <input name='passPhrase' value={dataz?.passPhrase} onChange={handleChange} type="text" className='w-full p-2 dark:bg-slate-500 dark:text-slate-100 font-medium outline-none border-slate-300 rounded-md' placeholder='new phrase...'/>
                    <button type='submit' className='w-full flex items-center justify-center p-2 max-sm:text-sm font-medium dark:text-slate-100 border active:bg-slate-600 rounded-md border-blue-500'>
                        {
                            load ? <ReactLoading type='spin' height={10} width={10} color='blue'/> : 'submit'
                        }
                    </button>
                </form>
            </div>
    </div>
  )
}

export default PassphrasePage