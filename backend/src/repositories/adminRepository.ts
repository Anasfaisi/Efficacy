import AdminModel from "../models/Admin.ts"
import BaseRepositoryImpl from "./baseRepository.ts"

const adminRepository = new BaseRepositoryImpl(AdminModel)
export default adminRepository