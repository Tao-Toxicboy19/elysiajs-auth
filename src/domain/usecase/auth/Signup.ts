import { Auth } from '../../entities/Auth'
import { IAuthRepository } from '../../interface/IAuthRepository'
import { JwtPayload } from '../../types/jwt-payload.type'

export class Signup {
    constructor(private authRepository: IAuthRepository) {}

    async execute(dto: Auth): Promise<JwtPayload> {
        return this.authRepository.signup(dto)
    }
}
