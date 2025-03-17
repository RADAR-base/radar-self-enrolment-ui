import { StudyProtocol } from "../../study/protocol";
import { ArmtDefinition } from "../definition/definition.types";
import { RadarRedcapDefinition } from "../definition/redcap.types";

export abstract class StudyArmtRepository {
  studyProtocol: StudyProtocol

  constructor(studyProtocol: StudyProtocol) {
    this.studyProtocol = studyProtocol
  }
  abstract getDefinition(armtId: string): Promise<RadarRedcapDefinition | undefined>
}