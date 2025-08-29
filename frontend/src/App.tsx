import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import NewBlog from './pages/NewBlog'
import Home from './pages/Home'
import ProtectedRoute from './router/ProtectedRoute'
import Profile from './pages/Profile'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        {/* Protected Routes */}
        <Route
          path='/blogs'
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path='/newBlog'
          element={
            <ProtectedRoute>
              <NewBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path='/blog/:id'
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/:id'
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
