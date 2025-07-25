import type { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}
type UserPayload = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
};
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}
