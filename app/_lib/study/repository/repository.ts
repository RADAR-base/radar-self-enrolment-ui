import { StudyProtocol } from "../protocol";

export abstract class StudyProtocolRepository {
  constructor() {}
  abstract getStudyProtocol(studyId: string): Promise<StudyProtocol>
}

