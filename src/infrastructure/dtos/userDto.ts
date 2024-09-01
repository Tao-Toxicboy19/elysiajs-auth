import { t } from 'elysia'

export const UserDto = t.Object({
    username: t.String(),
    password: t.String(),
    email: t.String(),
    picture: t.String(),
})
