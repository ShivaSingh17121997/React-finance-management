import React from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Analytics from '../pages/Analytics'
import Signup from '../pages/auth/Signup'
import Login from '../pages/auth/Login'
import { toast } from 'react-toastify'
import Counter from '../pages/Counter'

export default function AllRoutes() {
    const PrivateRoute = ({ children }) => {
        const hasToken = !!localStorage.getItem('token')
        const location = useLocation()
        if (!hasToken) {
            toast.warning('Please login to continue')
            return <Navigate to="/auth/login" state={{ from: location }} replace />
        }
        return children
    }
    return (
        <div className='w-full'>
            <Routes>
                <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} ></Route>
                <Route path='/analytics' element={<PrivateRoute><Analytics /></PrivateRoute>} ></Route>
                <Route path='/auth/signup' element={<Signup />} ></Route>
                <Route path='/auth/login' element={<Login />} ></Route>
                <Route path='/counter' element={<Counter />} ></Route>


            </Routes>
        </div>
    )
}
