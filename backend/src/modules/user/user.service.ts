import { prisma } from '../../utils/prisma';

// Type to represent a user
export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
}

// User data for creation (internal use)
export interface CreateUserData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      firstname: userData.firstname,
      lastname: userData.lastname,
      password: userData.password,
    },
  });

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}