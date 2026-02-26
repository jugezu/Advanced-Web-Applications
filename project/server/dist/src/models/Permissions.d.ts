import mongoose, { Document } from "mongoose";
interface Ipermissions extends Document {
    users: string;
    permisisonType: string;
}
declare const Permissions: mongoose.Model<Ipermissions>;
export { Permissions, Ipermissions };
//# sourceMappingURL=Permissions.d.ts.map