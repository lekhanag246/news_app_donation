import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'

import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Donate from './components/Donate.jsx'

import NewsListItem from './components/NewsListItem.jsx'
import NewsList from './components/NewsList.jsx'
import WishList from './components/WishList.jsx'
// import Thankyou from './Thankyou/index.js'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utilities/firebase.js'
export const userData = createContext()


const App = () => {
  const [uid, setUid] = useState("")
  const [wlItems, setWLItems] = useState([])

  useEffect(() => {
    localStorage.clear()
    onAuthStateChanged(auth, (user) => {
      if (auth && user !== null) {
        setUid(user.uid)
      } else {
        console.log("user has logged out")
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <userData.Provider value={{ uid: uid, wlItems: wlItems, setWLItems: setWLItems }}>
        <header>
          <Navbar setUid={setUid} />
          <h2 className='title'>my bitcoin news</h2>
        </header>
        <Routes>
          <Route path="/"
            element={<ProtectedRoute>
              <NewsList />
            </ProtectedRoute>}>
          </Route>
          <Route path='/news/:title'
            element={<ProtectedRoute>
              <NewsListItem />
            </ProtectedRoute>}>
          </Route>
          <Route path='/wishlist'
            element={<ProtectedRoute>
              <WishList />
            </ProtectedRoute>}>
          </Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/donate' element={<Donate />}></Route>
          {/* <Route path='/thankyou' element={<Thankyou />}></Route> */}
          <Route path='*' element={<h2 style={{ textAlign: 'center' }}>page not found</h2>}></Route>
        </Routes>
      </userData.Provider>
    </BrowserRouter>
  )
}

export default App
