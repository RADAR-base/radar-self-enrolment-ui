import { StudyProtocol } from "../index";
import { StudyProtocolRepository } from "./interface";
import { promises as fs } from 'fs';

export class LocalProtocolRepository implements StudyProtocolRepository {

  async getStudyProtocol(studyId: string): Promise<StudyProtocol | undefined> {
    if (!(await this.getStudies()).includes(studyId)) {
      return undefined
    }
    var protocol: StudyProtocol
    try {
      const file = await fs.readFile(process.cwd() + '/public/study/' + studyId + '/protocol.json', 'utf-8')
      protocol = JSON.parse(file)
      return protocol
    } catch (err) {
      console.log(err)
    }
  }
  async getStudies(): Promise<string[]> {
    return await (fs.readdir(process.cwd() + '/public/study/').then(l => l.filter(item => !/(^|\/)\.[^/.]/g.test(item))))
  }
}