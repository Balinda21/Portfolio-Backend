import { Request, Response, NextFunction } from 'express';
import UserModel, { IUser } from '../models/Users.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET!, async(err: jwt.VerifyErrors | null, decodedinfo: any) => {
   if(err) {
      console.log(err)
      res.locals.user = null
      next()
   } else {
      let user = await UserModel.findById(decodedinfo.id)
      console.log(decodedinfo)
      
      res.locals.user = user
      next()
   }
    })
  }else {
      res.locals.user = null
      next()
  }
}