import { Auth } from '../../domain/entities'
import { HttpError } from '../../domain/errors'
import { CustomContext, JwtPayload } from '../../domain/types'
import { Signin } from '../../domain/usecase'

export class AuthController {
    constructor(private signin: Signin) {}

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

    async refreshTokenHandler({
        set,
        jwtAccessToken,
        jwtRefreshToken,
        cookie: { access_token, refresh_token },
    }: CustomContext) {
        try {
            const payload = (await jwtRefreshToken.verify(
                refresh_token.value!
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
