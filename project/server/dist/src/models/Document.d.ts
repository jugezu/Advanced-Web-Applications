import mongoose from "mongoose";
interface IDocument {
    filename: string;
    text: string;
    owner: string;
    editedAt: Date;
    createdAt: Date;
    permissions: Ipermissions[];
    lock: string | null;
    status: string;
    sharedToken?: string;
}
export interface Ipermissions {
    users: string;
    permissionType: string;
}
declare const _default: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, mongoose.DefaultSchemaOptions> & IDocument & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IDocument>;
export default _default;
//# sourceMappingURL=Document.d.ts.map