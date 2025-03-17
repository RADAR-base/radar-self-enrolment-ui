type LoginMethod = "email";

export interface AuthResponse {
  ok: boolean;
  errors?: any[];
}

export abstract class ClientAuthService {
  constructor() {}

  abstract isLoggedIn(): Promise<boolean>;

  abstract getDisplayName(): Promise<string | undefined>;

  abstract getEmail(): Promise<string | undefined>;

  abstract getUid(): Promise<string | undefined>;

  // abstract isEmailVerified(): boolean;
  
  // abstract getUserMetadata(): any;

  // abstract updateUserMetadata(): any;
  
  abstract signIn(email: string, password: string): Promise<AuthResponse>;

  abstract register(email: string, password: string, traits?: {[key: string]: any}): Promise<AuthResponse>;

  abstract logOut(): Promise<AuthResponse>;

}

export abstract class ServerAuthService {
  
}