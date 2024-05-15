const { register, login, getAllEmployees, viewEmployee, updateEmployee, deleteEmployee } = require('../controller/authController');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('Auth Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user when request is valid', async () => {
      const req = { body: { username: 'suraj', password: 'suraj@123', email: 'surajo4@gmail.com', roles: ['Employee'] } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'suraj', email: 'surajo4@gmail.com', roles: ['Employee'] }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful' });
    });

    it('should return 400 status code and error message when password is missing', async () => {
      const req = { body: { username: 'suraj', email: 'surajo4@gmail.com', roles: ['Employee'] } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password is required' });
    });
    
  });

  describe('login', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should authenticate user and return JWT token', async () => {
      // Mock request and response objects
      const req = { body: { username: 'hasini', password: 'admin@123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
      // Mock user data
      const user = { _id: '123', username: 'hasini', password: 'hashedpassword', roles: ['Admin'] };
    
      // Mock User.findOne to return user data
      User.findOne.mockResolvedValueOnce(user);
    
      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValueOnce(true);
    
      // Mock jwt.sign to return a token
      jwt.sign.mockReturnValueOnce('mockedjwttoken');
    
      // Call login function with mocked request and response objects
      await login(req, res);
    
      // Expectations
      expect(User.findOne).toHaveBeenCalledWith({ username: 'hasini' });
      expect(bcrypt.compare).toHaveBeenCalledWith('admin@123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123', username: 'hasini', roles: ['Admin'] },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'mockedjwttoken' });
    });
  });
  
});
