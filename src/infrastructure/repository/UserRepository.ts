import { User } from '../../domain/entities'
import { HttpError } from '../../domain/errors'
import { IUserRepository } from '../../domain/interface'
import { UserType } from '../../domain/types'
import { UserModel } from '../schemas/UserSchema'

export class UserRepository implements IUserRepository {
    async createUser(dto: User): Promise<UserType> {
        const existsUser = await UserModel.findOne({
            username: dto.username,
        }).exec()
        const existsEmail = await UserModel.findOne({
            email: dto.email,
        })
        if (existsUser || existsEmail)
            throw new HttpError('User or email already exists.', 409)
        if (!dto.password) throw new HttpError('Require password.', 400)

        const hash = await Bun.password.hash(dto.password)
        const newUser = new UserModel({
            username: dto.username,
            password: hash,
        })
        await newUser.save()

        return Promise.resolve(newUser)
    }

    async profile(userId: string): Promise<UserType> {
        const user = await UserModel.findById({ _id: userId })
        if (!user) throw new HttpError('User not found.', 404)

        return Promise.resolve(user)
    }

    async updateUser(dto: User): Promise<UserType> {
        const user = await UserModel.findByIdAndUpdate({ _id: dto.id }, dto)
        if (!user) throw new HttpError('User not found.', 404)

        return Promise.resolve({} as UserType)
    }
}
