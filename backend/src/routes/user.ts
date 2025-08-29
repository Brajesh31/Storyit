import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'
import { jwt, sign,verify } from 'hono/jwt'
import { authMiddleware } from '../middleware/authMiddleWare'
import { auth } from 'hono/utils/basic-auth'
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

userRouter.post('/signup', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    if (!body.email || !body.password || !body.name) {
        return c.json({ error: 'Name, Email and password are required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })
    if (existingUser) {
        return c.json({ error: 'User already exists' })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const user = await prisma.user.create({
        data: {
            name: body.name || 'Anonymous',
            email: body.email,
            password: hashedPassword
        }
    })
    // Generate JWT token
    const jwtToken = await sign({ id: user.id }, c.env.JWT_SECRET)
    console.log('jwtToken: ', jwtToken)
    console.log('user: ', user)
    return c.json({
        message: 'User created successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            avatarLetter: user.name.charAt(0).toUpperCase()
        }
    })
})

userRouter.post('/signin', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    if (!body.email || !body.password) {
        return c.json({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })
    console.log('user: ', user);

    if (!user) {
        return c.json({ error: 'Invalid email' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(body.password, user.password)
    if (!isPasswordValid) {
        return c.json({ error: 'Invalid password' })
    }
    // Generate JWT token
    const jwtToken = await sign({ id: user.id }, c.env.JWT_SECRET)
    console.log('jwtToken: ', jwtToken)
    console.log('user: ', user)
    return c.json({
        message: 'User signed in successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            avatarLetter: user.name.charAt(0).toUpperCase()
        }
    })
})

userRouter.get('/verify',authMiddleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const id = c.get('userId')
    const token = c.get('token')
    console.log('id: ', id);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!user) {
            return c.json({ error: 'User not found' })
        }
        return c.json({
            message: 'User verified successfully',
            user: {
                id: user.id,
                name: user.name,
                token: token,
                email: user.email,
                avatarLetter: user.name.charAt(0).toUpperCase()
            }
        })
    } catch (error) {
        return c.json({ error: 'Invalid token' })
    }

})

userRouter.get('/profile',authMiddleware ,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const {id} = c.req.query()
    // console.log('id: ', id);
    if(!id){
        return c.json({ error: 'User ID is required' }, 400)
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                posts:true
            },
        })
        if (!user) {
            return c.json({ error: 'User not found' })
        }

        const posts = await prisma.post.findMany({
            where:{
                authorId:user.id
            },
            orderBy:{
                publishedDate: 'desc'
            }
        })

        return c.json({
            message: 'User profile fetched successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarLetter: user.name.charAt(0).toUpperCase(),
                blogs: posts || []
            }
        })
    } catch (error) {
        return c.json({ error: 'Invalid token' })
    }
})

export default userRouter
