import { Request, Response, NextFunction } from 'express';
export declare const isLoggedIn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkAuth: (req: Request, res: Response, next: NextFunction) => void;
