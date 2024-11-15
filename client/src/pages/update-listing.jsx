import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {useFormik} from 'formik'
import * as yup from 'yup'
import { app } from '../firebase'
import { connectStorageEmulator, getDownloadURL, getStorage, list, ref, uploadBytesResumable } from 'firebase/storage'
import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom'


const api = axios.create({
    baseURL : 'http://localhost:5001/api/listing',
    withCredentials:true
})

const UpdateListing = () => {

    const listingValues = {
        name:'',
        description:'',
        address:''   ,
        
        type:'rent',
        furnished:false,
        offer:false,
        parkingSpot:false,
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountedPrice:0,
        imageUrls:[],
        
        
    }

    const validationSchema = yup.object().shape({
        name:yup.string().required("Please enter a name"),
        description:yup.string().required("Please enter a description"),
        address:yup.string().required("Please enter an address"),
        imageUrls:yup.array().max(6, 'You can only upload 6 images per listing'),
        regularPrice:yup.number().required('Please enter a regular price'),
        discountedPrice:yup.number().required('Please enter a discounted price'),


    })




    const {currentUser} = useSelector(state => state.user)

    const [imageUploadError,setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [files , setFiles] = useState([])
    const [fromSubmitted, setFormSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    const navigate = useNavigate()
    const params = useParams()

    const {listingId }= params
    console.log(listingId)

    
    

    const formik = useFormik({
        initialValues: listingValues,
        enableReinitialize:true,
        validationSchema,
        onSubmit:(values) => {
            if( formik.values.imageUrls.length < 0 ) return setError('Please upload at least one image')
            if(formik.values.regularPrice < formik.values.discountedPrice) return setError('Discounted price must be lower than regular price')
            setError(false)
            setLoading(true)
            api.post(`/update/${listingId}`,{
                name:values?.name,
                description:values?.description,
                address:values?.address,
                type:values?.type,
                furnished:values?.furnished,
                offer:values?.offer,
                parking:values?.parkingSpot,
                bedrooms:values?.bedrooms,
                bathrooms:values?.bathrooms,
                regularPrice:values?.regularPrice,
                discountedPrice:values?.discountedPrice,
                imageUrls:values?.imageUrls,
                userRef:currentUser?._id

            }).then((response) =>{
                if(response.data.success === false){
                    setError(true)
                }
                console.log(response)
                setError(false)
                setLoading(false)
                navigate(`/listing/${response.data._id}`)
            }).catch((error)=>{
                console.log(error)
                setError(error.message)
                setLoading(false)
            })

            
        }
       
    })

    const handleImageSubmit = () => {

    
       
        if(files.length > 0 && files.length + formik.values.imageUrls.length < 7){
            setImageUploadError(false)
            setUploading(true)
            const promises = []
            const allUrls = []
            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]))
            }
            
            Promise.all(promises).then((urls) => {
                console.log(urls)
                
                formik.setFieldValue('imageUrls', [...formik.values.imageUrls, ...urls])
                setImageUploadError(false)
                setUploading(false)
            
            }).catch((error) => {
                setImageUploadError('Image Upload failed (2 mb max) per image')
                console.log(error)
                setUploading(false)
            })

        }else{
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)

        }
        
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage  = getStorage(app)
            const fileName = new Date().getTime() + file.name 
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

   

    useEffect(() => {
        handlefetchListing();
      }, []);
    
      const handlefetchListing = async () => {
        const { listingId } = params;
    
        try {
          const res = await api.get(`/getlisting/${listingId}`);
          const data = res.data;
          
          console.log(data);
    
          if (data.success === false) {
            console.log(data.message);
            return;
          }

          formik.setValues({ ...data });


          
    
    
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

   


     const handleDeleteImage = (index) => {
        const newUrls = formik.values.imageUrls.filter((url, i) => i != index)
        formik.setFieldValue('imageUrls', newUrls)

    }

   


  return (
    <main className=' p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>

        <form className='flex flex-col sm:flex-row gap-4' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col w-full gap-4 flex-1'>

        <div>
        <input
          id = 'name'
          type='text'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='Name'
          className='w-full p-3 border rounded-lg outline-none'

        />
         {formik.touched.name && formik.errors.name && (
                    <p className='text-red-500 text-sm'>{formik.errors.name}</p>
                )}
        </div>

        <div>
        <textarea
            id = 'address'
            value={formik.values.address}
            placeholder='address'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className='w-full p-3 border rounded-lg outline-none'
        >

        </textarea>
        {formik.touched.address && formik.errors.address && (
                    <p className='text-red-500 text-sm'>{formik.errors.address}</p>
                )}

        </div>

        <div>
        <input
          id = 'description'
          type='text'
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='description'
          className='w-full p-3 border rounded-lg outline-none'

        />
         {formik.touched.description && formik.errors.description && (
                    <p className='text-red-500 text-sm'>{formik.errors.description}</p>
                )}
        </div>

        <div className='flex gap-6 flex-wrap'>
        
        <div className='flex gap-2'>
            <input 
                type='checkbox' 
                className='w-5' 
                id='sale'
                checked={formik.values.type === 'sale'}
                onChange={() => {formik.setFieldValue('type', 'sale')}}
                onBlur={formik.handleBlur}
                
                />
            <span>Sale</span>
        </div>

        <div className='flex gap-2'>
            <input 
                type='checkbox' 
                className='w-5' 
                id='rent' 
                checked={formik.values.type === 'rent'}

                onChange={() => {formik.setFieldValue('type', 'rent')}}
                onBlur={formik.handleBlur}
            />
            <span>Rent</span>
        </div>

        <div className='flex gap-2'>
            <input 
                type='checkbox' 
                className='w-5' 
                id='parkingSpot' 
                checked={formik.values.parkingSpot}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            <span>Parking Spot</span>
        </div>

        <div className='flex gap-2'>
            <input 
                type='checkbox' 
                className='w-5' 
                id='furnished' 
                checked={formik.values.furnished}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            <span>Furnished</span>
        </div>

        <div className='flex gap-2'>
            <input 
                type='checkbox' 
                className='w-5' 
                id='offer' 
                checked={formik.values.offer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            <span>Offer</span>
        </div>

        </div>

        <div className='flex gap-6 flex-wrap'>

        <div className='flex gap-2 items-center'>
            <input 
                type='number'
                id='bedrooms'
                min='1' 
                max='10'
                value={formik.values.bedrooms}
                className='p-3 border border-grap-300 rounded-lg outline-none'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            <p>Beds</p>

        </div>

        <div className='flex gap-2 items-center'>
            <input 
                type='number'  min='1' max='10'
                id='bathrooms'
                value={formik.values.bathrooms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='p-3 border border-gray-300 rounded-lg outline-none'
            />
            <p>Baths</p>

        </div>

        <div className='flex gap-2 items-center'>
            <input 
                type='number' id='regularPrice' min='1' max='100000'
                value={formik.values.regularPrice}
                className='p-3  border border-gray-300 rounded-lg outline-none'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span>($ / month)</span>
            </div>

        </div>
        
        {
            formik.values.offer && (
                <div className='flex gap-2 items-center flex-wrap'>
                <input 
                    type='number' id='discountedPrice' min='0' max='100000'
                    value={formik.values.discountedPrice}
                    className='p-3 border border-gray-300 rounded-lg outline-none'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <div className='flex flex-col items-center'>
                    <p>Discounted Price</p>
                    <span>($ / month)</span>
                </div>
    
            </div>
            )
        }
       

        </div>

       
        

        </div>

        <div className='flex flex-col gap-4 flex-1'>
        
            <p className='font-semibold'>images: <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>  </p>
            <div className='flex gap-4'>
                <input 
                    onChange={(event) => setFiles(event.target.files)} 
                    type='file' 
                    id='files' 
                    accept='image/*' 
                    multiple  
                    className='border border-gray-600 p-3 w-full rounded-md' />
                <button 
                    type='button' 
                    onClick={handleImageSubmit} 
                    className='text-green-700 border border-green-600 p-3 uppercase hover:shadow-lg disabled:opacity-80  rounded-md'
                >{uploading ? 'Uploading' : 'Upload'}</button>

            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError }</p>
            
            {formik.values.imageUrls.length > 0 && formik.values.imageUrls.map((url, index) => (
                <div className='flex justify-between p-3 border  items-center' key={index}>
                <img 
                    src={url} 
                    
                    alt='listing-image' 
                    className='w-20 h-20 object-contain rounded-lg'
                />
                <button  
                    type='button' 
                    className=' p-3 rounded-lg uppercase hover:opacity-75 text-red-700'
                    onClick={() => handleDeleteImage(index)}
                >  Delete</button>
              </div>
            ))}


            <button 
                type='submit' 
                className='bg-slate-600 text-white uppercase p-3 rounded-lg'
                disabled={loading || uploading}
            >
                { loading ? 'Creating' :'Update Listing'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}

        </div>


        


        </form>
    </main>
  )
}

export default UpdateListing