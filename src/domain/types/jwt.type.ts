import { Context } from 'elysia'
import { JWTPayloadSpec } from '@elysiajs/jwt'

export interface CustomContext extends Context {
    jwtAccessToken: {
        sign: (
            payload: Record<string, string | number> & JWTPayloadSpec
        ) => Promise<string>
        verify: (
            token: string
        ) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
    }
    jwtRefreshToken: {
        sign: (
            payload: Record<string, string | number> & JWTPayloadSpec
        ) => Promise<string>
        verify: (
            token: string
        ) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
    }
}
