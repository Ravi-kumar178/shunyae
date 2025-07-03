import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import RegisterPage from './Pages/RegisterPage/RegisterPage'
import LoginPage from './Pages/LoginPage/LoginPage'
import HomePage from './Pages/HomePage/HomePage'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'

function App() {
  

  return (
    <div className='app'>
      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
