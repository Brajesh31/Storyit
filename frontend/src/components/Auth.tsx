import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'


interface LabeledInputProps {
  label: string
  placeholder: string
  type: 'text' | 'email' | 'password'
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function LabeledInput ({
  label,
  placeholder,
  onChange,
  type
}: LabeledInputProps) {
  return (
    <div className={`mt-3`}>
      <label className='text-mb font-semibold'>{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        onChange={onChange}
        className='w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-black-500'
      />
    </div>
  )
}

interface AuthProps {
  type: 'signup' | 'signin'
}

function Auth ({ type }: AuthProps) {
  const [signInInput, setSignInInput] = useState<{
    name: string
    email: string
    password: string
  }>({
    name: '',
    email: '',
    password: ''
  })
    const navigate = useNavigate()
    const {setUser,setAuthStatus} = useAuth()

  async function handleSubmit () {
    console.log(signInInput)
    try{
        const res = await axios.post(`${BACKEND_URL}/user/${type}`,{
            name: signInInput.name,
            email: signInInput.email,
            password: signInInput.password
        })
        console.log('res: ', res);
        const user = res.data.user
        console.log('user: ', user);
        localStorage.setItem('jwt', user.token)
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Successfully signed in!')
        setUser(user)
        setAuthStatus(true)
        navigate('/blogs')
    }
    catch (e){
        console.error('Error during authentication:', e)
        toast.error('Invalid credentials, please try again.')
        setAuthStatus(false)
    }
  }

  return (
    <div className='h-screen flex justify-center flex-col'>
      <Link to={'/'} className='w-max flex mx-auto mb-10'>
        <h1 className='playpen-sans-hebrew text-4xl font-medium'>Storyit</h1>
      </Link>
      <div className='flex justify-center flex-col'>
        <div className='text-center px-10'>
          <h1 className='text-4xl font-bold'>{
            type === 'signup'?"Create an account":'Sign In to your account'
            }</h1>
          <h2 className={`text-[#6f7079] mt-3 mb-2`}>
            {type === 'signup'
              ? 'Already have an account?'
              : "Don't have an account?"}
            <Link
              to={type === 'signup' ? '/signin' : '/signup'}
              className='underline ms-1'
            >
                {type === 'signup' ? 'Sign In' : 'Sign Up'}
            </Link>
          </h2>
        </div>
        <div className='px-6 sm:px-10 md:px-16 xl:px-24'>
          {type=="signup" &&  <LabeledInput
            label='Name'
            placeholder='Enter your name'
            type='text'
            onChange={e =>
              setSignInInput({ ...signInInput, name: e.target.value })
            }
          />}
          <LabeledInput
            label='Email'
            placeholder='Enter your Email'
            type='email'
            onChange={e =>
              setSignInInput({ ...signInInput, email: e.target.value })
            }
          />
          <LabeledInput
            label='Password'
            placeholder='Enter your password'
            type='password'
            onChange={e =>
              setSignInInput({ ...signInInput, password: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleSubmit}
          className='mt-4 bg-[#18181a] text-white p-2 font-semibold text-xl rounded-lg mx-6 sm:mx-10 md:mx-16 xl:mx-24'
        >
            {type === 'signup' ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

export default Auth
