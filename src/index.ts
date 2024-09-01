import { Elysia } from 'elysia'
import connectDB from './infrastructure/database/mongoose'
import authRoute from './application/routes/authRoute'
import userRoute from './application/routes/userRoute'
const app = new Elysia({ prefix: '/api' })

connectDB()

app.use(authRoute)
app.use(userRoute)

app.listen(3000)
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
