import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Signin from './pages/Signin';
import UpdateListing from './pages/update-listing';
import Listing from './pages/Listing';
import PrivateRoutes from './components/PrivateRoutes';
import CreateListing from './pages/create-listing';



const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/sign-in' element={<Signin/>} />
      <Route path='/sign-up' element={<SignUp/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/listing/:id' element={<Listing/>} />
      <Route element={<PrivateRoutes/>}>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/update-listing/:listingId' element={<UpdateListing/>} />
      </Route>
     


    </Routes>
    </BrowserRouter>
  )
}

export default App