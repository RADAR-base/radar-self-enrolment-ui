type LoginMethod = "email";

export interface AuthResponse {
  ok: boolean;
  errors?: any[];
}

export abstract class ClientAuthService {
  constructor() {}

  abstract isLoggedIn(): Promise<boolean>;

  abstract getDisplayName(): Promise<string | null>;

  abstract getEmail(): Promise<string | null>;

  abstract getUid(): Promise<string | null>;

  // abstract isEmailVerified(): boolean;
  
  // abstract getUserMetadata(): any;

  // abstract updateUserMetadata(): any;
  
  abstract signIn(email: string, password: string): Promise<AuthResponse>;

  abstract register(email: string, password: string, traits?: {[key: string]: any}): Promise<AuthResponse>;

  abstract logOut(): Promise<AuthResponse>;

}

export abstract class ServerAuthService {
  
}