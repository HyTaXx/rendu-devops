import bcrypt from 'bcrypt';
import type { RegisterInput } from './auth.schema';
import { createUser, findUserByEmail, type User } from '../user/user.service';

// Password strength validation
function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  // Character type checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Consecutive characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password must not contain more than 2 consecutive identical characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function registerUser(userData: RegisterInput): Promise<User> {
  // Additional password strength validation
  const passwordValidation = validatePasswordStrength(userData.password);
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password with higher salt rounds for better security
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // Create user with hashed password
  const newUser = await createUser({
    email: userData.email,
    firstname: userData.firstname,
    lastname: userData.lastname,
    password: hashedPassword,
  });

  return newUser;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Find user by email (this returns user with password)
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    return null;
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
