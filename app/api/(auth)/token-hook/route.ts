import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'

const getHydraPublicKeyEnv = () => (process as any).env.HYDRA_PUBLIC_KEY || (process as any).env.TOKEN_HOOK_PUBLIC_KEY
const getHydraAdminUrl = () => (process as any).env.HYDRA_ADMIN_URL

interface HydraTokenHookRequest {
    session: {
        id_token: {
            id_token_claims: {
                jti: string
                iss: string
                sub: string
                aud: string[]
                nonce: string
                at_hash: string
                acr: string
                amr: any
                c_hash: string
                ext: Record<string, any>
            }
            headers: {
                extra: Record<string, any>
            }
            username: string
            subject: string
        }
        extra: Record<string, any>
        client_id: string
        consent_challenge: string
        exclude_not_before_claim: boolean
        allowed_top_level_claims: string[]
    }
    request: {
        client_id: string
        granted_scopes: string[]
        granted_audience: string[]
        grant_types: string[]
        payload: {
            assertion: string[]
        }
    }
}

interface HydraTokenHookResponse {
    session: {
        access_token: Record<string, any>
        id_token: Record<string, any>
    }
}

async function validateAuth(request: NextRequest): Promise<boolean> {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
        // Get public key for verification
        const publicKey = await getHydraPublicKey()

        // Verify JWT signature and decode payload using jsonwebtoken
        const payload = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            clockTolerance: 30 // Allow 30 seconds clock skew
        }) as any

        // Validate issuer contains 'hydra'
        if (payload.iss && !payload.iss.includes('hydra')) {
            throw new Error('Invalid JWT issuer')
        }

        console.log('JWT token validated successfully:', {
            sub: payload.sub,
            exp: payload.exp,
            iat: payload.iat,
            iss: payload.iss
        })

        return true
    } catch (error) {
        console.error('JWT validation failed:', error)
        return false
    }
}

async function getHydraPublicKey(): Promise<string> {
    // If public key is provided via environment variable, use it
    const publicKey = getHydraPublicKeyEnv()
    if (publicKey) {
        return publicKey
    }

    // Otherwise, fetch it from Hydra's JWKS endpoint
    const adminUrl = getHydraAdminUrl()
    if (!adminUrl) {
        throw new Error('HYDRA_PUBLIC_KEY or HYDRA_ADMIN_URL must be configured')
    }

    try {
        const jwksUrl = `${adminUrl}/.well-known/jwks.json`
        const response = await fetch(jwksUrl)

        if (!response.ok) {
            throw new Error(`Failed to fetch JWKS: ${response.status}`)
        }

        const jwks = await response.json()

        // Find the appropriate key (usually the first one or match by kid)
        if (!jwks.keys || jwks.keys.length === 0) {
            throw new Error('No keys found in JWKS')
        }

        // Convert JWK to PEM format
        const key = jwks.keys[0]
        return convertJWKToPEM(key)
    } catch (error) {
        console.error('Failed to fetch Hydra public key:', error)
        throw new Error('Unable to retrieve Hydra public key')
    }
}

function convertJWKToPEM(jwk: any): string {
    // Convert JWK to PEM format using Node.js crypto
    const crypto = require('crypto')

    if (jwk.kty !== 'RSA') {
        throw new Error('Only RSA keys are supported')
    }

    // Convert base64url to base64 and add padding if needed
    const n = jwk.n.replace(/-/g, '+').replace(/_/g, '/')
    const e = jwk.e.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if needed
    const nPadded = n + '='.repeat((4 - n.length % 4) % 4)
    const ePadded = e + '='.repeat((4 - e.length % 4) % 4)

    // Create RSA public key object
    const publicKey = crypto.createPublicKey({
        key: {
            kty: 'RSA',
            n: nPadded,
            e: ePadded
        },
        format: 'jwk'
    })

    // Export as PEM
    return publicKey.export({ type: 'spki', format: 'pem' })
}

function validatePayload(payload: any): payload is HydraTokenHookRequest {
    return (
        payload &&
        payload.session &&
        payload.session.id_token &&
        payload.session.id_token.id_token_claims &&
        typeof payload.session.id_token.id_token_claims.sub === 'string' &&
        payload.request &&
        typeof payload.request.client_id === 'string'
    )
}

function userIsParticipant(userSession: any): boolean {
    return userSession?.identity?.schema_id == "subject"
}

function getUserId(userSession: any): string {
    if (userIsParticipant(userSession)) {
        const projects: any[] = userSession?.identity?.traits?.projects
        return projects[0]?.userId
    }
    return userSession?.identity?.id
}

// Helper function to extract session data - similar to consent route
const extractSession = (identity: any, grantScope: string[]) => {
    return {
        roles: identity.metadata_public.roles,
        authorities: identity.metadata_public.authorities,
        sources: identity.metadata_public.sources,
        user_name: identity.metadata_public.mp_login,
        email: identity.traits.email
    }
}

function enrichSessionWithClaims(session: any, identity: any, grantScope: string[]): HydraTokenHookResponse {
    try {
        // Use the same extractSession logic as the consent route
        const enrichedClaims = extractSession(identity, grantScope)

        // Create access token claims (for API access)
        const accessTokenClaims = {
            roles: enrichedClaims.roles,
            authorities: enrichedClaims.authorities,
            sources: enrichedClaims.sources,
            user_name: enrichedClaims.user_name,
            scope: grantScope
        }

        // Create ID token claims (for user identity)
        const idTokenClaims = {
            email: enrichedClaims.email,
            roles: enrichedClaims.roles,
            authorities: enrichedClaims.authorities,
            user_name: enrichedClaims.user_name
        }

        // Return the token hook response format
        return {
            session: {
                access_token: accessTokenClaims,
                id_token: idTokenClaims
            }
        }
    } catch (error) {
        console.error('Error enriching session with claims:', error)
        // Return empty session if enrichment fails
        return {
            session: {
                access_token: {},
                id_token: {}
            }
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        // Log incoming request
        console.log('Token hook request received:', {
            timestamp: new Date().toISOString(),
            headers: Object.fromEntries(request.headers.entries())
        })

        // Validate authentication
        // if (!(await validateAuth(request))) {
        //     console.error('Token hook authentication failed')
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     )
        // }

        // Parse and validate request body
        let payload: any
        try {
            payload = await request.json()
        } catch (error) {
            console.error('Failed to parse JSON payload:', error)
            return NextResponse.json(
                { error: 'Invalid JSON payload' },
                { status: 400 }
            )
        }

        // Log parsed payload
        console.log('Token hook payload:', JSON.stringify(payload, null, 2))

        // Validate required fields
        if (!validatePayload(payload)) {
            console.error('Invalid payload structure:', payload)
            return NextResponse.json(
                { error: 'Invalid payload structure. Required: session.id_token.id_token_claims.sub, request.client_id' },
                { status: 400 }
            )
        }

        // Check for required subject field
        if (!payload.session.id_token.id_token_claims.sub) {
            console.error('Missing required subject field')
            return NextResponse.json(
                { error: 'Missing required field: session.id_token.id_token_claims.sub' },
                { status: 400 }
            )
        }

        // Get fresh user data from Kratos Admin API using the kratos identity
        const kratosId = payload.session.extra.kratos_id
        const subject = payload.session.id_token.id_token_claims.sub
        let identity: any

        try {
            // Use Kratos admin API to get fresh user data
            const kratosAdminUrl = (process as any).env.KRATOS_ADMIN_URL

            if (!kratosAdminUrl) {
                throw new Error('KRATOS_ADMIN_URL or KRATOS_PUBLIC_URL must be configured')
            }

            const identityResponse = await fetch(`${kratosAdminUrl}/identities/${kratosId}`)

            if (!identityResponse.ok) {
                throw new Error(`Failed to fetch identity from Kratos: ${identityResponse.status}`)
            }

            const identityData = await identityResponse.json()
            identity = identityData // This will have the latest metadata

            console.log('Fresh identity data retrieved from Kratos:', {
                subject: identity.id,
                metadata_public: identity.metadata_public
            })

        } catch (error) {
            console.error('Error getting fresh identity from Kratos:', error)
            return NextResponse.json(
                { error: { type: 'authentication', content: { message: "Error getting fresh user data from Kratos" } } },
                { status: 403 }
            )
        }

        // Verify the subject matches the identity we retrieved
        if (identity.id !== kratosId) {
            console.error(`Subject mismatch: expected ${identity.id}, got ${kratosId}`)
            return NextResponse.json(
                { error: 'Subject mismatch with retrieved identity' },
                { status: 403 }
            )
        }

        // Extract grant scope from the request
        const grantScope = payload.request.granted_scopes || []

        // Enrich session with additional claims using Kratos identity
        let enrichedSession: HydraTokenHookResponse
        try {
            enrichedSession = enrichSessionWithClaims(payload.session, identity, grantScope)
        } catch (error) {
            console.error('Error enriching session with claims:', error)
            return NextResponse.json(
                { error: { type: 'session', content: { message: "User session could not be converted into token, may not have required role" } } },
                { status: 403 }
            )
        }

        // Log response
        console.log('Token hook response:', JSON.stringify(enrichedSession, null, 2))

        return NextResponse.json(enrichedSession)

    } catch (error) {
        console.error('Token hook error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
