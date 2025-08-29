import { Link } from 'react-router-dom'
import { formatDate } from '../utils/dateFormat'

interface BlogCardProps {
  id: string
  authorName: string
  title: string
  content: string
  publishedDate: string
  authorId: string
}

export function Avatar ({
  authorName
}: {
  authorName: string
  size?: number
}) {
  return (
    <p className={`bg-[#797979] rounded-full px-2.5 py-1 text-white text-sm font-semibold`}>
      {authorName.charAt(0).toUpperCase()}
    </p>
  )
}

function BlogCard ({
  id,
  authorName,
  title,
  content,
  publishedDate
}: BlogCardProps) {
  return (
    <Link to={`/blog/${id}`}>
      <div className='notosans border-b border-[#dfdfdf] p-4 w-screen max-w-screen-sm'>
        <div className='flex gap-1 text-lg'>
          <div className={`flex flex-col justify-center mt-0.5`}>
            <Avatar authorName={authorName}/>
          </div>
          <h1>{authorName}</h1>
          <div className={`flex flex-col justify-center`}>
            <div className='bg-[#797979] rounded-full w-1 h-1 mt-1'></div>
          </div>
          <div className={`flex flex-col justify-center`}>
            <p className='text-[#797979] text-sm'>
              {formatDate(publishedDate)}
            </p>
          </div>
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
        <p className='text-md text-[#6b6b6b] text-md'>
          {content.slice(0, 100) + '...'}
        </p>
        <p className='text-xs text-[#797979]'>
          {Math.ceil(content.length / 500)} min read
        </p>
      </div>
    </Link>
  )
}

export default BlogCard
