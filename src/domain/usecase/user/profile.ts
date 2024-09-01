import { IUserRepository } from '../../interface/IUserRepository'
import { UserType } from '../../types/User.type'

export class Profile {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string): Promise<UserType> {
        return this.userRepository.profile(userId)
    }
}
