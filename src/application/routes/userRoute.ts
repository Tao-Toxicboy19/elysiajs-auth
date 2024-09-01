import jwt from '@elysiajs/jwt'
import Elysia, { Context } from 'elysia'
import { JwtPayload, CustomContext } from '../../domain/types'
import { CreateUser, Profile, UpdateUser } from '../../domain/usecase'
import { UserDto } from '../../infrastructure/dtos'
import { UserRepository } from '../../infrastructure/repository'
import { UserController } from '../controller/UserController'

const userRepository = new UserRepository()
const createUserUseCase = new CreateUser(userRepository)
const profileUseCase = new Profile(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const userController = new UserController(
    createUserUseCase,
    profileUseCase,
    updateUserUseCase
)

export default new Elysia()
    .use(
        jwt({
            name: 'jwtAccessToken',
            secret: 'AT_SECRET',
        })
    )
    .derive(async ({ jwtAccessToken, cookie: { access_token } }) => {
        return (await jwtAccessToken.verify(access_token.value)) as JwtPayload
    })
    .group('user', (route) =>
        route
            .post(
                'create',
                (context: Context) => userController.createUserHandler(context),
                {
                    body: UserDto,
                }
            )
            .get(
                'profile',
                (context: CustomContext) =>
                    userController.profileHandler(context),
                {
                    beforeHandle: ({ set, sub }) => {
                        if (!sub) {
                            set.status = 401
                            return {
                                message: 'Unauthorized',
                                statusCode: 401,
                            }
                        }
                    },
                }
            )
            .patch(
                'update',
                (context: CustomContext) =>
                    userController.updateUserHandler(context),
                {
                    body: UserDto,
                    beforeHandle: ({ set, sub }) => {
                        if (!sub) {
                            set.status = 401
                            return {
                                message: 'Unauthorized',
                                statusCode: 401,
                            }
                        }
                    },
                }
            )
    )
