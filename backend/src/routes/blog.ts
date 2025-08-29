import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from "../middleware/authMiddleWare";
const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('*',authMiddleware)

blogRouter.get('/middlewareTest',(c)=>{
    return c.json({message: "Middleware is working"})
})

blogRouter.post('/',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    if (!body.title || !body.content) {
        return c.json({ error: 'Title and content are required' }, 400)
    }
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: c.get('userId')
        }
    })
    return c.json({
        message: 'Post created successfully',
        post: post
    })

})
blogRouter.put('/',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    if(!body.id){
        return c.json({ error: 'Post ID is required' }, 400)
    }
    const post = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        message: 'Post updated successfully',
        post: post
    })

})
blogRouter.get('/id/:id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const id = c.req.param('id')
    if(!id){
        return c.json({ error: 'Post ID is required' }, 400)
    }
    const post = await prisma.post.findUnique({
        where:{
            id:id
        },
        select:{
            id: true,
            title: true,
            content: true,
            publishedDate: true,
            author:{
                select:{
                    name: true,
                    id: true
                }
            }
        }
    })
    return c.json({
        message: 'Post fetched successfully',
        post: post
    })
})

// to do add pagination
blogRouter.get('/bulk',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const {page = 1, limit = 5} = c.req.query()
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;
    const posts = await prisma.post.findMany({
        select:{
            id:true,
            title:true,
            content:true,
            publishedDate:true,
            author:{
                select:{
                    name:true,
                    id:true
                }
            }
        },
        orderBy:{
            publishedDate:'desc'
        },
        skip: offset,
        take: limitNumber
    })
    // console.log('posts: ', posts);
    const totalPosts = await prisma.post.count();
    return c.json({
        message: 'Posts fetched successfully',
        posts: posts,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPosts / limitNumber),
            totalPosts: totalPosts,
            hasMore: offset + limitNumber < totalPosts
        }
    })
})

blogRouter.delete('/id/:id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const id = c.req.param('id')
    if(!id){
        return c.json({ error: 'Post ID is required' }, 400)
    }
    const postExists = await prisma.post.findUnique({
        where: {
            id: id,
            authorId: c.get('userId')
        }
    })
    if (!postExists) {
        return c.json({ error: 'Post not found or you are not the author' }, 404)
    }
    const post = await prisma.post.delete({
        where:{
            id: id
        }
    })
    return c.json({
        message: 'Post deleted successfully'
    })
})

export default blogRouter;