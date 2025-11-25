import { GitHubPageRepository } from './github'
import { LocalPageRepository } from './local'
import { FallbackPageRepository } from './fallback'

export { LocalPageRepository }
export { PageRepository } from './interface'

// Factory function to create repository instance at runtime
export function createPageRepository() {
    // Always return a fallback repository that tries primary (env) then other, then default
    return new FallbackPageRepository()
}

// For backward compatibility - uses factory function to get current instance
export default createPageRepository()