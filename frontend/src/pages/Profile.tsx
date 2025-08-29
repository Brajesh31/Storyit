import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/dateFormat'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Blog {
  id: string
  title: string
  content: string
  publishedDate: string
  authorId: string
}

interface UserInfo {
  id: string
  name: string
  email: string
  avatarLetter: string
  blogs?: Blog[]
}

function Profile () {
  const { user, setUser, setAuthStatus } = useAuth()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await axios.get(`${BACKEND_URL}/user/profile?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
      // console.log('res: ', res)
      if (res.data.user) {
        setUserInfo(res.data.user)
      } else {
        console.error('Failed to fetch user info')
      }
    }
    fetchUserInfo()
  }, [id, user?.token])

  async function handleDeletePost (postId: string) {
    const res = await axios.delete(`${BACKEND_URL}/blog/id/${postId}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
    if (res.data.message) {
      setUserInfo(prev => {
        if (!prev) return prev
        return {
          ...prev,
          blogs: prev.blogs?.filter(blog => blog.id !== postId)
        }
      })
      toast.success('Post deleted successfully')
    } else {
      console.error('Failed to delete post')
      toast.error('Failed to delete post')
    }
  }

  if (!userInfo) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading user info...
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center mt-10'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold'>
            {userInfo.avatarLetter}
          </div>
          <h1 className='text-2xl font-bold mt-4'>{userInfo.name}</h1>
          <p className='text-gray-600'>{userInfo.email}</p>
        </div>
        {userInfo.id === user?.id && (
          <div className='mt-4'>
            <button
              onClick={() => {
                navigate('/')
                localStorage.removeItem('user')
                localStorage.removeItem('jwt')
                setUser(null)
                setAuthStatus(false)
              }}
              className='px-3 py-1 bg-gray-400 rounded-lg'
            >
              Logout
            </button>
          </div>
        )}

        <div className='mt-10 w-full max-w-4xl px-4'>
          <h2 className='text-xl font-bold mb-4'>My Blogs</h2>
          {userInfo.blogs && userInfo.blogs.length > 0 ? (
            userInfo.blogs.map(blog => (
              <div key={blog.id} className='border-b border-gray-200 py-4'>
                <div className='flex justify-between items-center mb-2'>
                  <Link to={`/blog/${blog.id}`} key={blog.id}>
                    <h3 className='text-lg font-semibold'>{blog.title}</h3>
                  </Link>
                  {userInfo.id === user?.id && (
                    <button
                      onClick={() => {
                        handleDeletePost(blog.id)
                      }}
                      className='text-red-400 cursor-pointer'
                    >
                      Delete
                    </button>
                  )}
                </div>
                <Link to={`/blog/${blog.id}`} key={blog.id}>
                  <p className='text-gray-600'>
                    {blog.content.slice(0, 100)}...
                  </p>
                </Link>
                <p className='text-sm text-gray-500'>
                  Published on {formatDate(blog.publishedDate)}
                </p>
              </div>
            ))
          ) : (
            <p className='text-gray-600'>No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
