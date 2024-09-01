import jwt from '@elysiajs/jwt'
import Elysia from 'elysia'
import { JwtPayload, CustomContext } from '../../domain/types'
import { Signin } from '../../domain/usecase'
import { AuthDto } from '../../infrastructure/dtos'
import { AuthRepository } from '../../infrastructure/repository'
import { AuthController } from '../controller/AuthController'

const authRepository = new AuthRepository()
const signinUseCase = new Signin(authRepository)
const authController = new AuthController(signinUseCase)

export default new Elysia()
    .use(
        jwt({
            name: 'jwtAccessToken',
            secret: 'AT_SECRET',
        })
    )
    .use(
        jwt({
            name: 'jwtRefreshToken',
            secret: 'RT_SECRET',
        })
    )
    .derive(async ({ jwtRefreshToken, cookie: { refresh_token } }) => {
        return (await jwtRefreshToken.verify(refresh_token.value)) as JwtPayload
    })
    .group('auth', (route) =>
        route
            .post(
                'signin',
                (context: CustomContext) =>
                    authController.signinHandler(context),
                {
                    body: AuthDto,
                }
            )
            .post(
                'refresh-token',
                (context: CustomContext) =>
                    authController.refreshTokenHandler(context),
                {
                    beforeHandle: ({ sub, set }) => {
                        if (!sub) {
                            set.status = 401
                            return {
                                message: 'No Refresh token',
                                statusCode: 401,
                            }
                        }
                    },
                }
            )
    )
