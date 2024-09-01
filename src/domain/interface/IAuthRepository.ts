import { Auth } from '../entities'
import { JwtPayload } from '../types'

export interface IAuthRepository {
    signin(dto: Auth): Promise<JwtPayload>
}
