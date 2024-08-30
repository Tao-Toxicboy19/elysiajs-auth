import { Signin } from '../domain/usecase/auth/Signin'
import { Signup } from '../domain/usecase/auth/Signup'
import { Auth } from '../domain/entities/Auth'
import { HttpError } from '../domain/errors/HttpError'
import { CustomContext } from '../domain/types/jwt.type'
import { JwtPayload } from '../domain/types/jwt-payload.type'

export class AuthController {
    constructor(private signin: Signin, private signup: Signup) {}

    async signinHandler({
        set,
        body,
        jwtAccessToken,
        jwtRefreshToken,
        cookie: { access_token, refresh_token },
    }: CustomContext) {
        try {
            const { username, password } = body as Auth
            const user = new Auth(username, password)
            const payload = await this.signin.execute(user)

            access_token.set({
                value: await jwtAccessToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })
            refresh_token.set({
                value: await jwtRefreshToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })

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

    async signupHandler({
        set,
        body,
        jwtAccessToken,
        jwtRefreshToken,
        cookie: { access_token, refresh_token },
    }: CustomContext) {
        try {
            const { username, password } = body as Auth
            const user = new Auth(username, password)
            const payload = await this.signup.execute(user)
            access_token.set({
                value: await jwtAccessToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })
            refresh_token.set({
                value: await jwtRefreshToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })

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

    async refreshTokenHandler({
        set,
        jwtAccessToken,
        jwtRefreshToken,
        cookie: { access_token, refresh_token },
    }: CustomContext) {
        try {
            if (!refresh_token.value) {
                // handle error for refresh token is not available
                throw new HttpError('Refresh token is missing', 401)
            }

            const payload = (await jwtRefreshToken.verify(
                refresh_token.value
            )) as JwtPayload

            access_token.set({
                value: await jwtAccessToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })
            refresh_token.set({
                value: await jwtRefreshToken.sign(payload),
                httpOnly: true,
                maxAge: 7 * 86400,
            })

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
