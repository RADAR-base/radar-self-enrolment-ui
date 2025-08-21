import { GitHubPageRepository } from './github'
import { LocalPageRepository } from './local'

export { LocalPageRepository }
export { PageRepository } from './interface'

// Factory function to create repository instance at runtime
export function createPageRepository() {
    const repositoryType = process.env.STUDY_DEFINITION_REPOSITORY || 'GITHUB'
    return repositoryType === 'LOCAL' ? new LocalPageRepository() : new GitHubPageRepository()
}

// For backward compatibility - uses factory function to get current instance
export default createPageRepository()