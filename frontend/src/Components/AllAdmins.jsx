import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2';


function AllAdmins({ swal }) {
    const [admins, setAdmins] = useState([]);
    const [keyword,setKeyword] = useState('');

    useEffect(() => {
        getAdmins();
        console.log(admins);
    }, [])

    async function getAdmins() {
        const res = await axios.get('/allLocalAdmins');
        console.log(res.data.data);
        setAdmins(res.data.data);
    }


    function removeAdmin(id) {
        console.log(id);
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to Delete Admin?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes Delete!',
            reverseButtons: true,
            confirmButtonColor: '#f14d54'
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/admin/${id}`);
                    getAdmins();
                } catch (error) {
                    alert(error.response.data.error);
                }
            }
        })
    }

    useEffect(()=>{
        if(keyword){
            const searchedList = admins.filter(admin => admin.username.includes(keyword));
            setAdmins(searchedList);
        }
        else{
            getAdmins();
        }
    },[keyword])


    return (
        <div>
            <div className="w-4/5 max-w-full mx-auto mt-8 mb-6" >
                <input className='w-8/12 p-3 my-1 border rounded-lg' value={keyword} onChange={(ev) => setKeyword(ev.target.value)} type="text" placeholder="search" />
            </div>
            <table className="w-4/5 max-w-full mx-auto mt-8 mb-6 text-left border shadow-md " >
                <thead className='bg-orange-200 border'>
                    <tr className='mx-1 border-b'>
                        <th className='border  py-1 sm:py-2 md:py-2 text-[10px] md:text-base text-center'>Email</th>
                        <th className='border  py-1 sm:py-2 md:py-2 text-[10px] md:text-base text-center'>Contact Number</th>
                        <th className='border  py-1 sm:py-2 md:py-2 text-[10px] md:text-base text-center'>City</th>
                        <th className='border  py-1 sm:py-2 md:py-2 text-[10px] md:text-base text-center'>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {admins?.map((admin) => (
                        <tr className="text-gray-800 border-b" key={admin._id}>
                            <td className="p-1 font-medium font-montserrat sm:font-openSans sm:font-normal md:p-3 border text-clip overflow-hidden text-left text-[8px] md:text-sm "><div >{admin.username}</div></td>
                            <td className="p-1 font-medium font-montserrat sm:font-openSans sm:font-normal md:p-3 border text-clip overflow-hidden text-left text-[8px] md:text-sm "><div >{admin.contact}</div></td>
                            <td className="p-1 font-medium font-montserrat sm:font-openSans sm:font-normal md:p-3 border text-clip overflow-hidden text-center text-[8px] md:text-sm "><div>{admin.city}</div></td>
                            <td className="p-1 font-medium font-montserrat sm:font-openSans sm:font-normal md:p-3 border text-clip overflow-hidden text-center text-[8px] md:text-sm ">
                                <button onClick={() => removeAdmin(admin._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
        </div>

    )
}



export default withSwal(({ swal }, ref) => (
    <AllAdmins swal={swal} />
));