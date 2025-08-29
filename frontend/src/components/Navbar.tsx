import { Link, useLocation } from 'react-router-dom'
import { Avatar } from './BlogCard'
import { useAuth } from '../hooks/useAuth'
function Navbar ({ onPublish }: { onPublish?: () => void }) {
  const { authStatus, user } = useAuth()
  const location = useLocation()
  // console.log('authStatus: ', authStatus);
  return (
    <div className='flex justify-between items-center py-4 px-6 lg:px-10 border-b-2 border-[#dfdfdf]'>
      <Link to={'/'}>
        <h1 className='playpen-sans-hebrew text-2xl font-medium'>Storyit</h1>
      </Link>
      {authStatus && user && (
        <div className='flex items-center gap-4 text-black'>
          {location.pathname !== '/newBlog' && (
            <div className='flex items-center gap-4'>
              <Link to={'/blogs'}>Blogs</Link>
              <Link to={'/newBlog'}>New Blog</Link>
            </div>
          )}
          {location.pathname === '/newBlog' && (
            <div className='flex items-center gap-4'>
              <button onClick={onPublish} className='text-white px-3 cursor-pointer bg-black rounded-xl '>
                Publish
              </button>
              <Link to={'/blogs'}>Blogs</Link>
            </div>
          )}
          <Link to={'/profile/'+ user.id}>
          <Avatar authorName={user.name} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
