import { useBlog } from '../hooks/useBlog'
import { Link, useParams } from 'react-router-dom'
import { Avatar } from '../components/BlogCard'
import Navbar from '../components/Navbar'
import { formatDate } from '../utils/dateFormat'

function BlogSkeleton () {
  return (
    <div>
      <Navbar />
      <div className='grid grid-cols-12 px-6 lg:px-12 mt-10 gap-4 animate-pulse'>
        <div className='notosans col-span-12 lg:col-span-8'>
          <div className='h-8.5 bg-gray-200 rounded-lg w-full mb-4'></div>
          <div className='h-8.5 bg-gray-200 rounded-lg w-full mb-4'></div>
          <div className='h-2.5 bg-gray-200 rounded-full w-40 mb-4'></div>
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className='h-2.5 bg-gray-200 rounded-full w-full mb-4'
            ></div>
          ))}
        </div>
        <div className='col-span-12 mb-4 lg:col-span-4'>
          <div className='h-2.5 bg-gray-200 rounded-full w-20 md:w-30 mb-4'></div>
          <div className='flex items-center gap-1'>
            <div className='h-2.5 bg-gray-200 rounded-full w-3 mb-4 p-3'></div>
            <div className='h-2.5 bg-gray-200 rounded-full w-55 mb-4'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Blog () {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Blog ID not found
      </div>
    )
  }
  const { loading, blog } = useBlog(id)
  console.log('blog: ', blog)
  if (loading) {
    return <BlogSkeleton />
  }

  if (!blog) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Blog not found
      </div>
    )
  }

  const paragraphs = blog.content.split(/\n+/)
  return (
    <div>
      <Navbar />
      <div className='grid grid-cols-12 px-6 lg:px-12 mt-10 gap-4'>
        <div className='notosans col-span-12 lg:col-span-8'>
          <h1 className='text-3xl font-bold mb-2'>{blog.title}</h1>
          <p className='text-xs text-[#797979] my-2'>
            Posted on {formatDate(blog.publishedDate)}
          </p>
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className='text-md text-[#6b6b6b] mb-4 text-justify whitespace-pre-wrap'
            >
              {para}
            </p>
          ))}
        </div>
        <div className='col-span-12 mb-4 lg:col-span-4'>
          <p className='text-md font-semibold mb-1 text-[#0f0f0f]'>Author</p>
          <Link
          to={'/profile/' + blog.author.id}
          >
            <div className='flex items-center gap-1'>
              <Avatar authorName={blog.author.name} />
              <h1 className='text-lg font-bold'>{blog.author.name}</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Blog
