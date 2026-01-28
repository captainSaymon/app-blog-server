import UserModel from '../schemas/user.schema';
import { IUser } from '../models/user.model';

class UserService {
    public async create(userData: IUser) {
        const newUser = new UserModel(userData);
        return await newUser.save();
    }

    public async getByEmail(email: string) {
        return await UserModel.findOne({ email });
    }

    public async getById(id: string) {
        return await UserModel.findById(id);
    }

    public async getAll() {
        return await UserModel.find({});
    }

    public async deleteAll() {
        return await UserModel.deleteMany({});
    }
}

export default UserService;