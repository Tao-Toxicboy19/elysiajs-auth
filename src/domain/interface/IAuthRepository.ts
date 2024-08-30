import { Auth } from '../entities/Auth'
import { JwtPayload } from '../types/jwt-payload.type'

export interface IAuthRepository {
    signin(dto: Auth): Promise<JwtPayload>
    signup(dto: Auth): Promise<JwtPayload>
    refreshToken(dto: JwtPayload): Promise<JwtPayload>
}
