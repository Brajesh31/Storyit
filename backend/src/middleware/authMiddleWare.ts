import { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'

export const authMiddleware: MiddlewareHandler<{
  Bindings: {
    JWT_SECRET: string
  },
  Variables: {
    userId: string
    token: string
  }
}> = async (c, next) => {
    const header = c.req.header('Authorization')
    if (!header || !header.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: No token' }, 401)
    }
    const token = header.split(' ')[1]
    try {
        const payload = await verify(token, c.env.JWT_SECRET)
        if(!payload){
            return c.json({ error: 'Unauthorized: Invalid token' }, 401)
        }
        console.log('payload: ', payload);
        c.set('userId', String(payload.id))
        c.set('token', token)
        await next()
    } catch (e) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }
}
