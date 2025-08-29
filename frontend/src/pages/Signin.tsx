import Auth from '../components/Auth'
import Quote from '../components/Quote'

function Signin() {
  return (
    <div className='lg:grid lg:grid-cols-2'>
      <Auth type='signin'/>
      <div className='hidden lg:block'>
        <Quote />
      </div>
    </div>
  )
}

export default Signin