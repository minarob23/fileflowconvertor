
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { type RequestHandler } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export function checkSubscription(requiredPlan: 'free' | 'pro' | 'enterprise'): RequestHandler {
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  
  return async (req, res, next) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userPlanLevel = planHierarchy[user.subscriptionPlan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({ 
        message: `This feature requires ${requiredPlan} plan or higher`,
        currentPlan: user.subscriptionPlan,
        requiredPlan 
      });
    }

    next();
  };
}
