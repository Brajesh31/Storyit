import { Hono } from 'hono'
import blogRouter from './routes/blog'
import userRouter from './routes/user'
import { cors } from 'hono/cors'

const app = new Hono()
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)
app.route('api/v1/user', userRouter)
app.route('api/v1/blog', blogRouter)

app.get('/', c => {
  return c.text('Hello Hono!')
})

export default app
