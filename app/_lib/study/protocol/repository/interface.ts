import { StudyProtocol } from "..";

export abstract class StudyProtocolRepository {
  constructor() {}
  abstract getStudyProtocol(studyId: string): Promise<StudyProtocol | undefined>
  abstract getStudies(): Promise<string[]>
}

