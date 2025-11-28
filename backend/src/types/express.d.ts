declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      profileImage?: string | null;
      isVerifiedSeller: boolean;
      emailVerified?: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}

export { };