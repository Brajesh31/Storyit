import { useEffect, useState } from 'react'
import type { Blog } from './useBlogs'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useAuth } from './useAuth'

export const useBlog = (id: string) => {
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState<Blog>()
  const { user } = useAuth()

  useEffect(() => {
    const cachedBlog = localStorage.getItem(`blog_${id}`)
    if (cachedBlog) {
      const parsed = JSON.parse(cachedBlog)
      const now = new Date().getTime()
      if (!parsed.expiry || now < parsed.expiry) {
        setBlog(parsed.data)
        setLoading(false)
        return
      } else {
        localStorage.removeItem(`blog_${id}`)
      }
    } else {
      setLoading(true)
      axios
        .get(`${BACKEND_URL}/blog/id/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        })
        .then(response => {
          setBlog(response.data.post)
          const expiry = new Date().getTime() + 60 * 60 * 1000
          localStorage.setItem(
            `blog_${id}`,
            JSON.stringify({
              data: response.data.post,
              expiry: expiry
            })
          )
          setLoading(false)
        })
    }
  }, [id, user?.token])
  return { loading, blog }
}
