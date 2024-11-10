import { StudyProtocol } from "..";

export abstract class StudyProtocolRepository {
  constructor() {}
  abstract getStudyProtocol(studyId: string): Promise<StudyProtocol>
  abstract getStudies(): Promise<string[]>
}

