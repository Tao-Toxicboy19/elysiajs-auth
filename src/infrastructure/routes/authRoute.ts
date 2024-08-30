import Elysia, { Context, t } from 'elysia'
import { AuthRepository } from '../repository/AuthRepository'
import { Signin } from '../../domain/usecase/auth/Signin'
import { Signup } from '../../domain/usecase/auth/Signup'
import { AuthController } from '../../application/AuthController'
import jwt, { JWTPayloadSpec } from '@elysiajs/jwt'
import { CustomContext } from '../../domain/types/jwt.type'

const authRepository = new AuthRepository()
const signinUseCase = new Signin(authRepository)
const signupUseCase = new Signup(authRepository)
const authController = new AuthController(signinUseCase, signupUseCase)

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
    .group('auth', (route) =>
        route
            .post(
                'signin',
                (context: CustomContext) =>
                    authController.signinHandler(context),
                {
                    body: t.Object({
                        username: t.String(),
                        password: t.String(),
                    }),
                }
            )
            .post(
                'signup',
                (context: CustomContext) =>
                    authController.signupHandler(context),
                {
                    body: t.Object({
                        username: t.String(),
                        password: t.String(),
                    }),
                }
            )
            .post('refresh', (context: CustomContext) =>
                authController.refreshTokenHandler(context)
            )
    )
