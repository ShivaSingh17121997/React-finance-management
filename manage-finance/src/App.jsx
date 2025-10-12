
import './App.css'
import Navbar from './components/Navbar'
import AllRoutes from './routes/AllRoutes'
import React, { useEffect, useState } from 'react'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from 'react-router-dom';



function App() {
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('token'))
  const location = useLocation().pathname
  console.log(location)

  useEffect(() => {
    const handle = () => setHasToken(!!localStorage.getItem('token'))
    window.addEventListener('storage', handle)
    window.addEventListener('token-change', handle)
    return () => {
      window.removeEventListener('storage', handle)
      window.removeEventListener('token-change', handle)
    }
  }, [])

  return (
    <div className={hasToken ? "min-h-screen lg:pl-64 pt-16 lg:pt-0" : "min-h-screen"}>
      <AllRoutes />
      {hasToken && (location !== "/auth/login" || location !== "/auth/signup") &&  <Navbar />}

      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App
