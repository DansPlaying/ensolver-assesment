import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}
