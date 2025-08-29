import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authStatus,loading } = useAuth()
  if(loading){
    return <div className='flex text-3xl justify-center items-center h-screen'>
        Authenticating...
    </div>
  }
  if (!authStatus && location.pathname === '/') {
    return children
  }
  if (!authStatus) {
    return <Navigate to='/signin' />
  }

  return children
}

export default ProtectedRoute
