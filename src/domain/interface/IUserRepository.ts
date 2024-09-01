import { User } from '../entities'
import { UserType } from '../types'

export interface IUserRepository {
    profile(userId: string): Promise<UserType>
    createUser(dto: User): Promise<UserType>
    updateUser(dto: User): Promise<UserType>
}
