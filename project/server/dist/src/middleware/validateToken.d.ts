import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface CustomRequest extends Request {
    user?: JwtPayload;
}
export declare const validateToken: (req: CustomRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validateToken.d.ts.map