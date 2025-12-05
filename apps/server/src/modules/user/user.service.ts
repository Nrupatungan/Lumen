import { RegisterInput } from "../../lib/validators/auth.validator.js";
import User from "./user.model.js";

export class UserService {
  static async createUser(data: RegisterInput) {
    return await User.create(data);
  }

  static async findByEmail(email: string) {
    return await User.findOne({ email }).lean();
  }

  static async findById(id: string) {
    return await User.findById(id).lean();
  }

}
