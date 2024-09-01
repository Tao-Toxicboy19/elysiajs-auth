import { Context } from 'elysia'
import { User } from '../../domain/entities'
import { HttpError } from '../../domain/errors'
import { CustomContext } from '../../domain/types'
import { CreateUser, Profile, UpdateUser } from '../../domain/usecase'

export class UserController {
    constructor(
        private createUser: CreateUser,
        private profile: Profile,
        private updateUser: UpdateUser
    ) {}

    async createUserHandler({ set, body }: Context) {
        try {
            const { email, username, password, picture } = body as User
            const user = new User({ username, password, email, picture })
            const payload = await this.createUser.execute(user)
            return {
                message: 'User created successfully',
                result: payload, // คุณสามารถกำหนด payload ที่จะส่งกลับได้ตามที่ต้องการ
            }
        } catch (error) {
            if (error instanceof HttpError) {
                set.status = error.statusCode
                return {
                    message: error.message,
                    statusCode: error.statusCode,
                }
            } else {
                set.status = 500
                return {
                    message: error,
                    statusCode: 500,
                }
            }
        }
    }

    async profileHandler({ set, sub }: CustomContext) {
        try {
            const user = await this.profile.execute(sub)
            return {
                message: 'Profile fetched successfully',
                result: user,
            }
        } catch (error) {
            if (error instanceof HttpError) {
                set.status = error.statusCode
                return {
                    message: error.message,
                    statusCode: error.statusCode,
                }
            } else {
                set.status = 500
                return {
                    message: error,
                    statusCode: 500,
                }
            }
        }
    }

    updateUserHandler({ set, body, sub }: CustomContext) {
        try {
            const { username, email, picture } = body as User
            const user = new User({ id: sub, username, email, picture })
            return 'ok'
        } catch (error) {
            if (error instanceof HttpError) {
                set.status = error.statusCode
                return {
                    message: error.message,
                    statusCode: error.statusCode,
                }
            } else {
                set.status = 500
                return {
                    message: error,
                    statusCode: 500,
                }
            }
        }
    }
}
