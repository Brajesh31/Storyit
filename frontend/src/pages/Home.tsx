import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

function Home () {
  const {authStatus} = useAuth()
  return (
    <div className='bg-[#f7f4ed]'>
      <Navbar />
      <div>
        <div className='flex justify-center h-screen flex-col mx-10 md:mx-20 pb-26 md:pb-10'>
          <h1 className='playfair text-6xl md:text-8xl/30 font-semibold mb-10'>
            Stories worth telling & ideas worth sharing
          </h1>
          <p className='text-xl'>A home to read, write, and discover yourself</p>
          <Link to={
            authStatus ? '/blogs' : '/signup'
          } className='bg-black text-white rounded-full py-1.5 mt-10 text-md w-max px-6 md:text-xl'>Start reading</Link >
        </div>
      </div>
    </div>
  )
}

export default Home
