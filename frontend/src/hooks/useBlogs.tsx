import axios from 'axios'
import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../config'
import { useAuth } from './useAuth'

export interface Blog {
  id: string
  title: string
  content: string
  author: {
    name: string
    id: string
  }
  publishedDate: string
}

export const useBlogs = () => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()
  // console.log('user: ', user);

  const fetchBlogs = async (pageNumber: number, isInitial = false) => {
    if (!hasMore) return

    if (isInitial) {
      setInitialLoading(true)
    } else {
      setLoadingMore(true)
    }
    try {
      const res = await axios.get(
        `${BACKEND_URL}/blog/bulk?page=${pageNumber}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      )
      const data = res.data.posts
      setBlogs(prevBlogs => [...prevBlogs, ...data])
      setHasMore(data.length > 0)
      setPage(pageNumber)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
    if (isInitial) {
      setInitialLoading(false)
    } else {
      setLoadingMore(false)
    }
  }
  useEffect(() => {
    fetchBlogs(1, true)
  }, [])

  const loadMoreBlogs = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchBlogs(nextPage)
    }
  }

  return {
    initialLoading,
    loadingMore,
    blogs,
    hasMore,
    loadMoreBlogs
  }
}
