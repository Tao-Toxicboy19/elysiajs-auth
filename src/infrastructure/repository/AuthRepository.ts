import { ObjectId } from 'mongoose'
import { Auth } from '../../domain/entities'
import { HttpError } from '../../domain/errors'
import { IAuthRepository } from '../../domain/interface'
import { JwtPayload } from '../../domain/types'
import { UserModel } from '../schemas/UserSchema'

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
}
