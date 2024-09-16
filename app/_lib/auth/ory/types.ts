export type OryAuthenticationMethod = {
  completed_at: string,
  method: string,
  aal?: string,
  organization?: string,
  provider?: string
}

export type OrySessionDevice = {
  id: string,
  ip_address: string,
  location: string,
  user_agent: string
}

export type OryCredentials = any;

export type OryTraits = {
  email: string,
}

export type OryIdentity = {
  created_at: string,
  credentials?: OryCredentials,
  id: string,
  metadata_admin?: any,
  metadata_public?: any,
  organization_id?: string,
  recovery_addresses?: any[],
  schema_id?: string,
  schema_url?: string,
  state?: string,
  state_changed_at?: string,
  traits?: any,
  updated_at?: string,
  verifiable_addresses: any[],
}

export type OrySessionResponse = {
  active: boolean,
  authenticated_at: string,
  authentication_methods: OryAuthenticationMethod[],
  authenticator_assurance_level: string,
  devices: OrySessionDevice[],
  expires_at: string,
  id: string,
  identity: OryIdentity,
  issued_at: string,
  tokenized?: string
}

export class OrySession {
  public active: boolean
  public authenticated_at: Date
  public authentication_methods: OryAuthenticationMethod[]
  public expires_at: Date
  public identity: OryIdentity
  public issued_at: Date

  constructor(data: OrySessionResponse) {
    this.active = data.active
    this.authenticated_at = new Date(data.authenticated_at)
    this.authentication_methods = data.authentication_methods
    this.expires_at = new Date(data.expires_at)
    this.identity = data.identity as OryIdentity
    this.issued_at = new Date(data.issued_at)
  }
}