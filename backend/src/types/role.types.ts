import { IAdminRepository } from "@/repositories/interfaces/IAdmin.repository"
import { IMentorRepository } from "@/repositories/interfaces/IMentor.repository"
import { IUserRepository } from "@/repositories/interfaces/IUser.repository"

export type Role  = "user"|"mentor"|"admin"
export type Repositories = IAdminRepository | IUserRepository | IMentorRepository