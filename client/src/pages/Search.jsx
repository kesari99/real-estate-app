import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const Search = () => {

    const [sidebardata, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort:'created_at',
        order:'desc'

    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)

    const navigate = useNavigate()

    


    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id  === 'rent' || e.target.id === 'sale'){
            setSidebarData({...sidebardata, type:e.target.id})

        }
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebardata, searchTerm:e.target.value})
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer' ){
            setSidebarData({...sidebardata, [e.target.id]:e.target.checked || e.target.checked === 'true' ? true : false})
        }

        if(e.target.id === 'sort_order'){
          
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'
            setSidebarData({...sidebardata, sort, order})

    }
}

useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrlParams = urlParams.get('searchTerm')
    const typeFRomUrlParams = urlParams.get('type')
    const offerFromUrlParams = urlParams.get('offer')
    const parkingFromUrlParams = urlParams.get('parking')
    const furnishedFromUrlParams = urlParams.get('furnished')
    const sortFromUrlParams = urlParams.get('sort')
    const orderFromUrlParams = urlParams.get('order')

    if(
        searchTermFromUrlParams || 
        typeFRomUrlParams ||
        offerFromUrlParams ||
        parkingFromUrlParams ||
        furnishedFromUrlParams ||
        sortFromUrlParams ||
        orderFromUrlParams

    ){
        setSidebarData({
            searchTerm:searchTermFromUrlParams || '',
            type:typeFRomUrlParams || 'all',
            offer:offerFromUrlParams === 'true'? true: false,
            parking:parkingFromUrlParams === 'true'? true: false,
            furnished:furnishedFromUrlParams === 'true'? true: false,
            sort:sortFromUrlParams || 'created_at',
            order:orderFromUrlParams || 'desc'

        })
    }

    
}, [location.search])

const handleSubmit = (e) => {
    e.preventDefault()

    
    const urlParams = new URLSearchParams()

    urlParams.set('searchTerm', sidebardata.searchTerm)
    urlParams.set('type', sidebardata.type)
    urlParams.set('offer', sidebardata.offer)
    urlParams.set('parking', sidebardata.parking)
    urlParams.set('furnished', sidebardata.furnished)
    urlParams.set('sort', sidebardata.sort)
    urlParams.set('order', sidebardata.order)

    const searchQuery = urlParams.toString()

    navigate(`/search?${searchQuery}`)

    const fetchListing = async () => {
        setLoading(true)
        setShowMore(false)
        const searchQuery = urlParams.toString()


        const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if(data.length > 8){
            setShowMore(true)
        }
        else{
            setShowMore(false)
        }

        setListings(data)

        setLoading(false)


    }

    fetchListing()




}

const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings 
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searhcQuery = urlParams.toString()
    const res = await fetch(`https://real-estate-app-a14s.onrender.com/api/listing/get?${searhcQuery}`)
    const data = await res.json()

    if(data.length < 9){
        setShowMore(false)
    }

    setListings([...listings, ...data])
}


    return (
        <div className='flex flex-col sm:flex-row '>
            <div className="p-3 border-b-2 md:border-r-2 md:min-h-screen">

                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap'>Search Term</label>
                        <input
                            type="text"
                            id='searchTerm'
                            placeholder="Search..."
                            className="p-2 rounded-lg border w-full outline-none"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='all'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}

                            />
                            <span>Rent & Sale</span>
                        </div>


                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                            checked={sidebardata.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='sale'
                                className='w-5'
                                onChange={handleChange}
                            checked={sidebardata.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                            checked={sidebardata.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">

                        
                            <label className='font-semibold'>
                                Amenities:

                            </label>
                            <div>
                                <input
                                type='checkbox'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.parking}


                            />
                            <span>Parking</span>
                            </div>
                            <div>
                                <input
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.furnished}

                            />
                            <span>Furnishes</span>
                            </div>

                        


                    </div>

                    <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            {loading ? 'Searching...' : 'Search'}
          </button>





                </form>


            </div>

            <div className='flex-1'>
                <h1  className="text-3xl font-semibold p-3 border-b text-slate-700 mt-5">Lisintg Page</h1>
                <div className='p-7 grid sm:grid-cols-3 gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700 text-center w-full '>No listing Found</p>
                    )

                    }
                    {
                        loading && (
                            <p className='text-xl text-slate-700 text-center w-full '>Loading...</p>
                        )
                    }

                    {
                        !loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)
                    }

                    {showMore && (
                        <button
                            onClick = {onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        
                        >
                            Show More
                        </button>
                    )}

                </div>

            </div>


        </div>
    )
}

export default Search