import { User } from "../../entities/User";
import { IUserRepository } from "../../interface/IUserRepository";
import { UserType } from "../../types/User.type";

export class UpdateUser {
    constructor(private userRepository:IUserRepository){}

    async execute(dto:User):Promise<UserType>{
        return this.userRepository.updateUser(dto)
    }
}