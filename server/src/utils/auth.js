import jwt from 'jsonwebtoken';
export const generateToken = (id) => jwt.sign({id}, 'secret');