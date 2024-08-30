import { Elysia } from 'elysia'
import connectDB from './infrastructure/database/mongoose'
import authRoute from './infrastructure/routes/authRoute'
const app = new Elysia({ prefix: '/api' })

connectDB()

app.use(authRoute)
app.listen(3000)
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
