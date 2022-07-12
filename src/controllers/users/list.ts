import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = getRepository(User);
  try {
    const users = await userRepository.find({
      select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
    });
    const objectResult = {
      content: users,
      links: [
        { rel: 'self', method: 'GET', href: 'http://127.0.0.1:4000/v1/users/:id' },
        { rel: 'create', method: 'POST', title: 'Create User', href: 'http://127.0.0.1:4000/v1/users/createUser' },
      ],
    };
    res.customSuccess(200, 'List of users.', objectResult);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of users.`, null, err);
    return next(customError);
  }
};
