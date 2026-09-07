import { ArmtGithubRedcapDefinitionLink, ArmtProtocol, StudyProtocol } from "../../study/protocol";
import { RadarRedcapDefinition } from "../definition/redcap.types";
import { StudyArmtRepository } from "./interface";
import { promises as fs } from 'fs';
import githubClient from "../../github/services/github-client";
import { GITHUB_CONFIG } from "../../github/config/github-config";

function buildGithubContentsUrl(link: ArmtGithubRedcapDefinitionLink): string {
  const org = link.org || GITHUB_CONFIG.ORGANIZATION_NAME
  const repo = link.project || GITHUB_CONFIG.REPOSITORY_NAME
  const ref = link.ref || GITHUB_CONFIG.DEFINITIONS_BRANCH
  return `${GITHUB_CONFIG.API_URL}/repos/${org}/${repo}/contents/${link.avsc}?ref=${ref}`
}

async function fetchGithubRedcapDefinition(link: ArmtGithubRedcapDefinitionLink): Promise<RadarRedcapDefinition> {
  const url = buildGithubContentsUrl(link)
  const data = await githubClient.getData(url)
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return JSON.parse(content) as RadarRedcapDefinition
}

export async function getDefinition(armtProtocol: ArmtProtocol) {
  switch (armtProtocol.metadata.type) {
    case "inbuilt":
      break
    case "redcap_github":
      return await fetchGithubRedcapDefinition(armtProtocol.metadata.definitionLink)
    case "redcap_local":
      const file = await fs.readFile(process.cwd() + armtProtocol.metadata.path, 'utf-8')
      return JSON.parse(file) as RadarRedcapDefinition
    default:
      break
  }
}

export class ArmtDefinitionRepository implements StudyArmtRepository {
  studyProtocol: StudyProtocol;
  armtProtocols: {[key: string]: ArmtProtocol | undefined} = {};

  constructor(studyProtocol: StudyProtocol) {
    this.studyProtocol = studyProtocol
    this.parseProtocol(studyProtocol)
  }

  private parseProtocol(studyProtocol: StudyProtocol) {
    studyProtocol.protocols.map(
      (armt) => {
        this.armtProtocols[armt.id] = armt
      }
    )
  }

  async getDefinition(armtId: string): Promise<RadarRedcapDefinition | undefined> {
    if (armtId in this.armtProtocols) {
      const armtProtocol = this.armtProtocols[armtId]
      if (armtProtocol != undefined) {
        return getDefinition(armtProtocol)
      }
    }
  }

}