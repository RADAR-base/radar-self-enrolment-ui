import { ArmtProtocol, StudyProtocol } from "../../study/protocol";
import { ArmtDefinition, ArmtItem } from "../definition/definition.types";
import fromRedcapDefinition from "../definition/fromRedcapDefinition";
import { RadarRedcapDefinition } from "../definition/redcap.types";
import { StudyArmtRepository } from "./interface";
import { promises as fs } from 'fs';


export async function getDefinition(armtProtocol: ArmtProtocol) {
  let items: ArmtItem[] = []
  let definition: ArmtDefinition
  switch (armtProtocol.metadata.type) {
    case "inbuilt":
      break
    case "redcap_github":
      break
    case "redcap_local":
      const file = await fs.readFile(process.cwd() + armtProtocol.metadata.path, 'utf-8')
      return (await JSON.parse(file)) as RadarRedcapDefinition
      break
    default:
      break
  }
}

export class ArmtDefinitionRepository implements StudyArmtRepository {
  studyProtocol: StudyProtocol;
  armtProtocols: {[key: string]: ArmtProtocol} = {};

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
    return getDefinition(this.armtProtocols[armtId])
  }

}