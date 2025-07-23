import type { CreateUserInput } from './user.schema';

// Type to represent a user
export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
}

// Temporary in-memory database (to be replaced with a real DB)
const users: User[] = [];

export async function createUser(userData: CreateUserInput): Promise<User> {
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email: userData.email,
    firstname: userData.firstname,
    lastname: userData.lastname,
    password: userData.password, // In production, hash the password
  };

  users.push(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = users.find(user => user.email === email);
  return user || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = users.find(user => user.id === id);
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}