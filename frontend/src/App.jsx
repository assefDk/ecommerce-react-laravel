import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home'
import Shop from './components/common/Shop'
 

function App() {

  return (
    <>
      {/* <div>hello i am app file</div> */}
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
