import mongoose, { Document } from "mongoose";
interface IUser extends Document {
    email: string;
    password: string;
}
declare const User: mongoose.Model<IUser>;
export { User, IUser };
//# sourceMappingURL=User.d.ts.map