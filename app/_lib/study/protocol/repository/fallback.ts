import { StudyProtocol } from "..";
import { StudyProtocolRepository } from "./interface";
import { GitHubProtocolRepository } from "./github";
import { LocalProtocolRepository } from "./local";
import { DEFAULT_STUDY_ID } from "@/app/_lib/study/config";

export class FallbackProtocolRepository implements StudyProtocolRepository {
    private primary: GitHubProtocolRepository | LocalProtocolRepository;
    private localRepo: LocalProtocolRepository;
    private githubRepo: GitHubProtocolRepository;

    constructor() {
        const repositoryType = process.env.STUDY_DEFINITION_REPOSITORY || "GITHUB";
        this.githubRepo = new GitHubProtocolRepository();
        this.localRepo = new LocalProtocolRepository();
        this.primary = repositoryType === "LOCAL" ? this.localRepo : this.githubRepo;
    }

    async getStudyProtocol(studyId: string): Promise<StudyProtocol | undefined> {
        // 1) Try primary (GitHub by default)
        try {
            const protocol = await this.primary.getStudyProtocol(studyId);
            if (protocol) return protocol;
        } catch (_) {
            // swallow and continue to fallback
        }

        // 2) Try the other source explicitly if primary failed (GitHub <-> Local)
        try {
            const secondary =
                this.primary instanceof GitHubProtocolRepository
                    ? this.localRepo
                    : this.githubRepo;
            const protocol = await secondary.getStudyProtocol(studyId);
            if (protocol) return protocol;
        } catch (_) {
            // swallow and continue to fallback
        }

        // 3) Fallback to default bundled study definition
        try {
            console.log("Fallback to default bundled study definition", DEFAULT_STUDY_ID);
            const defaultProtocol = await this.localRepo.getStudyProtocol(
                DEFAULT_STUDY_ID
            );
            // Return default UI but keep the requested studyId for routing and API calls
            return defaultProtocol
                ? { ...defaultProtocol, studyId, name: studyId }
                : undefined;
        } catch (_) {
            return undefined;
        }
    }

    async getStudies(): Promise<string[]> {
        const results = new Set<string>();
        try {
            for (const id of await this.githubRepo.getStudies()) results.add(id);
        } catch (_) { }
        try {
            for (const id of await this.localRepo.getStudies()) results.add(id);
        } catch (_) { }
        // Always include the default study id so the app can run out-of-the-box
        results.add(DEFAULT_STUDY_ID);
        return Array.from(results);
    }
}


