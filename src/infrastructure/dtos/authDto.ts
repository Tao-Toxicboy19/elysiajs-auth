import { t } from 'elysia'

export const AuthDto = t.Object({
    username: t.String(),
    password: t.String(),
})
