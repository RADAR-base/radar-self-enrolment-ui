import { NextRequest, NextResponse } from "next/server"

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

function validateAuth(request: NextRequest): boolean {
    const apiKey = process.env.TOKEN_HOOK_API_KEY
    if (!apiKey) {
        return true
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
        return false
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader

    return token === apiKey
}

function isClientCredentialsGrant(payload: any): boolean {
    return payload?.request?.grant_types?.includes('client_credentials') ?? false
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

const extractSession = (identity: any, grantScope: string[]) => {
    return {
        roles: identity.metadata_public.roles,
        authorities: identity.metadata_public.authorities,
        sources: identity.metadata_public.sources,
        user_name: identity.metadata_public.mp_login,
        email: identity.traits.email,
        kratos_id: identity.id
    }
}

function enrichSessionWithClaims(session: any, identity: any, grantScope: string[], grantType?: string): HydraTokenHookResponse {
    try {
        // Use the same extractSession logic as the consent route
        const enrichedClaims = extractSession(identity, grantScope)

        // Create access token claims (for API access)
        const accessTokenClaims = {
            roles: enrichedClaims.roles,
            authorities: enrichedClaims.authorities,
            sources: enrichedClaims.sources,
            user_name: enrichedClaims.user_name,
            scope: grantScope,
            grant_type: grantType,
            kratos_id: enrichedClaims.kratos_id
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
        // Log incoming request. Headers are deliberately not logged: they carry the
        // Authorization bearer token used to authenticate the hook.
        console.log('Token hook request received:', {
            timestamp: new Date().toISOString()
        })

        // Validate authentication
        if (!validateAuth(request)) {
            console.error('Token hook authentication failed')
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

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

        // client_credentials has no user session — skip Kratos enrichment
        if (isClientCredentialsGrant(payload)) {
            console.log('Skipping token hook for client_credentials grant:', {
                client_id: payload.request?.client_id,
            })
            return NextResponse.json({
                session: {
                    access_token: {
                        grant_type: payload.request?.grant_types?.[0],
                        scope: payload.request?.granted_scopes || [],
                        audience: payload.request?.granted_audience || [],
                        aud: payload.request?.granted_audience || [],
                        client_id: payload.request?.client_id,
                    },
                    id_token: {}
                }
            })
        }

        // Validate required fields
        if (!validatePayload(payload)) {
            console.error('Invalid payload structure:', payload)
            return NextResponse.json(
                { error: 'Invalid payload structure. Required: session.id_token.id_token_claims.sub, request.client_id' },
                { status: 400 }
            )
        }

        // Get kratos_id from session.extra (set as session.access_token during consent)
        const kratosId = payload.session?.extra?.kratos_id
        if (!kratosId) {
            console.error('Missing kratos_id in session.extra')
            return NextResponse.json(
                { error: 'Missing kratos_id in session' },
                { status: 400 }
            )
        }

        let identity: any
        try {
            const kratosAdminUrl = process.env.KRATOS_ADMIN_URL
            if (!kratosAdminUrl) {
                throw new Error('KRATOS_ADMIN_URL must be configured')
            }

            const identityResponse = await fetch(`${kratosAdminUrl}/identities/${kratosId}`)
            if (!identityResponse.ok) {
                throw new Error(`Failed to fetch identity from Kratos: ${identityResponse.status}`)
            }

            identity = await identityResponse.json()
        } catch (error) {
            console.error('Error getting fresh identity from Kratos:', error)
            return NextResponse.json(
                { error: { type: 'authentication', content: { message: "Error getting fresh user data from Kratos" } } },
                { status: 403 }
            )
        }

        // Extract grant scope from the request
        const grantScope = payload.request.granted_scopes || []

        // Enrich session with additional claims using Kratos identity
        let enrichedSession: HydraTokenHookResponse
        try {
            const grantType = payload.request.grant_types?.[0]
            enrichedSession = enrichSessionWithClaims(payload.session, identity, grantScope, grantType)
        } catch (error) {
            console.error('Error enriching session with claims:', error)
            return NextResponse.json(
                { error: { type: 'session', content: { message: "User session could not be converted into token, may not have required role" } } },
                { status: 403 }
            )
        }

        return NextResponse.json(enrichedSession)

    } catch (error) {
        console.error('Token hook error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
