import { PageRepository } from "./interface";
import { WebsitePageContent } from "..";
import { GitHubPageRepository } from "./github";
import { LocalPageRepository } from "./local";
import { DEFAULT_STUDY_ID } from "@/app/_lib/study/config";

export class FallbackPageRepository implements PageRepository {
  private primary: GitHubPageRepository | LocalPageRepository;
  private githubRepo: GitHubPageRepository;
  private localRepo: LocalPageRepository;

  constructor() {
    const repositoryType = process.env.STUDY_DEFINITION_REPOSITORY || "GITHUB";
    this.githubRepo = new GitHubPageRepository();
    this.localRepo = new LocalPageRepository();
    this.primary = repositoryType === "LOCAL" ? this.localRepo : this.githubRepo;
  }

  async getLandingPage(studyId: string): Promise<WebsitePageContent> {
    // 1) Try primary
    try {
      return await this.primary.getLandingPage(studyId);
    } catch (_) {}
    // 2) Try the other
    try {
      const secondary =
        this.primary instanceof GitHubPageRepository
          ? this.localRepo
          : this.githubRepo;
      return await secondary.getLandingPage(studyId);
    } catch (_) {}
    // 3) Fallback to default
    return await this.localRepo.getLandingPage(DEFAULT_STUDY_ID);
  }

  async getAllPageRoutes(studyId: string): Promise<string[][]> {
    // Combine; fallback to default if none
    try {
      const routes = await this.primary.getAllPageRoutes(studyId);
      if (routes?.length) return routes;
    } catch (_) {}
    try {
      const secondary =
        this.primary instanceof GitHubPageRepository
          ? this.localRepo
          : this.githubRepo;
      const routes = await secondary.getAllPageRoutes(studyId);
      if (routes?.length) return routes;
    } catch (_) {}
    return await this.localRepo.getAllPageRoutes(DEFAULT_STUDY_ID);
  }

  async getPage(
    studyId: string,
    route: string[],
  ): Promise<WebsitePageContent | undefined> {
    // 1) Try primary
    try {
      const page = await this.primary.getPage(studyId, route);
      if (page) return page;
    } catch (_) {}
    // 2) Try secondary
    try {
      const secondary =
        this.primary instanceof GitHubPageRepository
          ? this.localRepo
          : this.githubRepo;
      const page = await secondary.getPage(studyId, route);
      if (page) return page;
    } catch (_) {}
    // 3) Fallback to default study's page
    return await this.localRepo.getPage(DEFAULT_STUDY_ID, route);
  }

  async getAllStudyIds(): Promise<string[]> {
    const results = new Set<string>();
    try {
      for (const id of await this.githubRepo.getAllStudyIds()) results.add(id);
    } catch (_) {}
    try {
      for (const id of await this.localRepo.getAllStudyIds()) results.add(id);
    } catch (_) {}
    results.add(DEFAULT_STUDY_ID);
    return Array.from(results);
  }
}


