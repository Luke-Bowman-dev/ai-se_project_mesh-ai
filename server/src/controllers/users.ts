import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getCurrentUser = async (
 req: Request,
 res: Response,
): Promise<void> => {
 const userId = req.user?.userId;
 try {
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
        res.status(404).json(  {
    success: false,
    data: null,
    error: { message: "User not found" },
  })
    }
    else {
         res.status(200).json({
    success: true,
    data: {
      userId: userId,
      email: user.email,
      name: user.name
    },
    error: null,
  })
    }
    
    
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};