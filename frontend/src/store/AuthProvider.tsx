import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { BACKEND_URL } from '../config'
type UserData = {
  id: string
  name: string
  email: string
  token: string
  avatarLetter: string
}

const AuthContext = createContext<{
  user: UserData | null
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>
  authStatus: boolean | null
  setAuthStatus: React.Dispatch<React.SetStateAction<boolean | null>>
  loading: boolean
}>({
  user: null,
  setUser: () => {},
  authStatus: false,
  setAuthStatus: () => {},
  loading: true
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [authStatus, setAuthStatus] = useState<boolean | null>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const verifyToken = async () => {
    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      setAuthStatus(false)
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/user/verify`,{
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      // console.log('response: ', response);
      setAuthStatus(true)
      setUser(response.data.user)
    } catch (error) {
      console.error('Error verifying token:', error)
      setAuthStatus(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, setUser, authStatus, setAuthStatus, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export { AuthContext }
