import { StudyProtocol } from "../protocol";
import { StudyProtocolRepository } from "./repository";
import { promises as fs } from 'fs';

export class LocalProtocolRepository implements StudyProtocolRepository {
  async getStudyProtocol(studyId: string): Promise<StudyProtocol> {
    var protocol: StudyProtocol
    try {
      const file = await fs.readFile(process.cwd() + '/public/study/' + studyId + '/protocol.json', 'utf-8')
      protocol = JSON.parse(file)
      return protocol
    } catch (err) {
      console.log(err)
    }
    throw new Error('Can not load study protocol for studyId: ' + studyId)
  }
}