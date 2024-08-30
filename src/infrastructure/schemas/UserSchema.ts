import { Schema, model, Document } from 'mongoose'

interface IUser extends Document {
    username: string
    email: string
    password: string
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const UserModel = model<IUser>('user', UserSchema)

export { UserModel, IUser }
