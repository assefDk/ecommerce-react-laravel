import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import Checkout from './components/Checkout'


function App() {

  return (
    <>
      {/* <div>hello i am app file</div> */}
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/product' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />


          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
