import { Auth } from '../../domain/entities/Auth'
import { HttpError } from '../../domain/errors/HttpError'
import { IAuthRepository } from '../../domain/interface/IAuthRepository'
import { JwtPayload } from '../../domain/types/jwt-payload.type'
import { UserModel } from '../models/User'
import { ObjectId, Types } from 'mongoose'

export class AuthRepository implements IAuthRepository {
    async signin(dto: Auth): Promise<JwtPayload> {
        const user = await UserModel.findOne({ username: dto.username }).exec()
        if (user && (await Bun.password.verify(dto.password, user.password))) {
            return Promise.resolve({
                sub: (user._id as ObjectId).toString(),
                username: user.username,
            })
        }
        throw new HttpError('Unauthorized', 401)
    }

    async signup(dto: Auth): Promise<JwtPayload> {
        const exists = await UserModel.findOne({
            username: dto.username,
        }).exec()
        if (exists) throw new HttpError('User already exists.', 409)
        const hash = await Bun.password.hash(dto.password)
        const newUser = new UserModel({
            username: dto.username,
            password: hash,
        })
        await newUser.save()
        return Promise.resolve({
            sub: (newUser._id as ObjectId).toString(),
            username: newUser.username,
        })
    }

    refreshToken(dto: JwtPayload): Promise<JwtPayload> {
        return Promise.resolve(dto)
    }
}
