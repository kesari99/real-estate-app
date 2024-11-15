import { connectStorageEmulator } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing }) => {
    console.log(listing.UserRef)

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('')
    


    useEffect(() => {
        const fetchLandLord = async () => {

            try{
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json()

                if(data.success === false){
                    console.error(data.message)
                    return
                }
                setLandlord(data)

            }catch(error){
                console.error('Error fetching data:', error);
            }

        }

        fetchLandLord()
    }, [listing.UserRef])

    const onChange = (e) => {
        setMessage(e.target.value)

    }


  return (
    <div>
        {landlord && (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea 
                    name="message" 
                    id="message" 
                    rows="2" 
                    value={message} 
                    onChange={onChange}
                    placeholder='Type your message here'
                    className='w-full p-3 border rounded-lg'
                
                >

                </textarea>

                <Link
                    to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                    className='bg-slate-700 text-white p-3 uppercase rounded-lg text-center hover:opacity-95'
                >
                    send message
                </Link>

            </div>
        )}
    </div>
  )
}

export default Contact