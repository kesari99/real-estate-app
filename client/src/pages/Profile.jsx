import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase"
import { Link } from "react-router-dom"
import { updateUserStart,
  updateUserFailure, 
  updateUserSuccess,
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
 } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"

export default function Profile() {
  const {currentUser, loading,error } = useSelector(state => state.user)
  const [file ,setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUpError, setFileUpError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [listings, setLisings] = useState([])
  console.log(listings)


  const fileRef = useRef(null)
  const dispatch = useDispatch()

 
  

  

  // firebase storage 
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = async (file) => {
    const storage = getStorage(app)
    const fileName =  new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUpError(true)
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadUrl) => {
          setFormData({...formData, avatar: downloadUrl})

        })
      }
    );






      
     
    
  }

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
        dispatch(updateUserStart())
        const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/user/update/${currentUser._id}`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        })

        const data =  await res.json()
        if(data.success === false){
          dispatch(updateUserFailure(data.message))
          return;
        }

        dispatch(updateUserSuccess(data))
        setUpdateSuccess(true)
        

    }catch(err){
      dispatch(updateUserFailure(err.message))

    }

    
  }

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/user/delete/${currentUser._id}`, {
        method:'DELETE',
        headers:{
          'Content-Type':'application/json'
        },
    })
    const data = await res.json()
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }

    dispatch(deleteUserSuccess())


    }catch(err){
      dispatch(deleteUserFailure(err.message))
    }
  }
  const handleSignOut = async () => {

    try{
      dispatch(signOutUserStart)
      const res = await fetch('https://real-estate-app-a14s.onrender.com/api/auth/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data))


    }catch(err){
      dispatch(signOutUserFailure(err.message))

    }



  }

  const handleShowListing = async () => {
    try{
      setShowListingError(false)
      const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if(data.success == false){
        setShowListingError(true)
        return;
      }
      setLisings(data)


    }catch(error){
      setShowListingError(true)
    }


  }

  const handleDeleteList = async (id) => {

    try{
      const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/listing/delete/${id}`, {
        method:'DELETE',
       
      })

      const data = await res.json()

      if (data.success === false){
        console.log(data.message)
        return
      }

      setLisings((prev) => prev.filter((eachList) => eachList._id !== id))

      

    }catch(error){

      console.log(error)

    }



  }

  



  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img 
          src={formData.avatar || currentUser.avatar} alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
          onChange={handleChange}
        />
        <p className="text-sm self-center">
          {fileUpError ? (
            <span className="text-red-700">Error Upload image(image must be less than 2MB)</span>
               ) : filePerc > 0 && filePerc < 100 ?  (
                <span className="text-slate-700">
                  {`Uploading ${filePerc}%`}
                </span> 
              ) : filePerc === 100 ? (
                  <span className="text-green-700"> Image Successfully uploaded</span>
              
              ) : (
                ""
              )

              
            }
        </p>
        <input 
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
          className="border p-3 rounded-lg "
        />
        <input 
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input 
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled::opacity-80">
          {loading ? 'Loading...': 'Update'}
        </button>
        <Link className="bg-green-700 text-white rounded-lg  p-3 uppercase text-center hover:opacity-95 disabled:opacity-80" to='/create-listing'>Create Listing</Link>

         
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>

       


      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700">{updateSuccess ? 'User is updated successfully' : ''}</p>
      
      <button
         className="text-green-700 w-full text-center"
         onClick={handleShowListing}
      >Show Listing</button>

      <p className="text-red-700">{showListingError ? 'Error showing Listings' : ''}</p>

      


        { listings && listings.length > 0 &&

        <div className="flex flex-col gap-4">

          <h1 className="text-center text-2xl mt-7 font-semibold" >Your Listing</h1>
        
        
        {listings.map((eachList) => (
          <div key={eachList._id} className="w-full gap-4 p-4" >
           
          
            {eachList.imageUrls.length > 0 &&  <div className=" border rounded-lg flex justify-between p-3 gap-4 items-center ">
              <Link to={`listing/${eachList._id}`}>
            <img 
              src={eachList.imageUrls[0]} 
              alt="listing-image"  
              className="h-16 w-16 object-contain "
            />
            </Link>

            <Link to={`/listing/${eachList._id}`} className="text-slate-700 font-semibold flex-1 hover:underline truncate ">
            <p> {eachList.name}</p>
            </Link>

            <div className="flex flex-col">
              <button onClick={() => handleDeleteList(eachList._id)} className="text-red-700 uppercase"> DELETE</button>
              
              <Link to={`/update-listing/${eachList._id}`}>
              <button className="text-green-700 uppercase"> edit</button>
              </Link>



            </div>



            
            </div>}
           
          
           
          </div>

        ))}

       </div>
        
        
        }


      

    </div>
  )
}
