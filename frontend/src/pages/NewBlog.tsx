import { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function NewBlog () {
  const [blogData,setBlogData] = useState({
    title: '',
    content: ''
  })
  const {user} = useAuth()
  const navigate = useNavigate()

  const handlePublish = async () => {
    if(!blogData.title || !blogData.content) {
      toast.error('Title and content cannot be empty!')
      return
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/blog`,{
        title: blogData.title,
        content: blogData.content
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
      console.log('response: ', response);
      toast.success('Blog published successfully!')
      navigate(`/blog/${response.data.post.id}`)
    } catch (error) {
      console.error('Error publishing blog:', error)
    }
  }
  return (
    <div>
      <Navbar onPublish={handlePublish}/>
      <div className='flex justify-center px-2'>
        <div className='max-w-2xl'>
          <textarea
            rows={2}
            placeholder='Title'
            className='w-full pb-2 text-3xl md:text-5xl playfair focus:outline-none focus:ring-0 leading-none mt-6 resize-none'
            style={{
              scrollbarWidth: 'none'
            }}
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
          />
          <textarea
            placeholder='Write your content...'
            value={blogData.content}
            onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
            className='w-full h-screen text-md md:text-lg leading-6 playfair focus:outline-none focus:ring-0 resize-none text-justify '
          />
        </div>
      </div>
    </div>
  )
}

export default NewBlog
