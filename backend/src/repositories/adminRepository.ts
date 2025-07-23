import AdminModel from "../models/Admin"
import BaseRepositoryImpl from "./baseRepository"

const adminRepository = new BaseRepositoryImpl(AdminModel)
export default adminRepository