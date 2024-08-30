import { IAuthRepository } from '../../interface/IAuthRepository'
import { JwtPayload } from '../../types/jwt-payload.type'

export class RefreshToken {
    constructor(private authRepository: IAuthRepository) {}

    async execute(dto: JwtPayload): Promise<JwtPayload> {
        return this.authRepository.refreshToken(dto)
    }
}
