import { FooterProps } from "@/app/_ui/components/footer";
import { IRadioItem, ITextItem, IYesNoItem } from "@/app/_lib/armt/definition/field.interfaces"
import { ThemeOptions } from "@mui/material";
import { ArmtItem } from "../../armt/definition/definition.types";
import { RadarRedcapDefinition } from "../../armt/definition/redcap.types";

export type OnboardingStep = {};
export type OnboardingMetadata = {};
export type Onboarding = {
  metadata: OnboardingMetadata;
  steps: OnboardingStep[];
};

export type EligibilityItem = IYesNoItem
export type ConsentItem = IYesNoItem

export type EnrolmentStudyInformation = {
  title?: string,
  content?: string
};

export type EnrolmentEligibility = {
  title?: string,
  description?: string,
  items: EligibilityItem[]
}


export type EnrolmentConsent = {
  title?: string,
  description?: string,
  requiredItems: ConsentItem[],
  optionalItems?: ConsentItem[],
  signatureDescription?: string
};

export type EnrolmentAdditional = {
  title?: string,
  description?: string,
  items: RadarRedcapDefinition // ArmtItem[],
};

export type EnrolmentAccount = {
  title?: string,
  description?: string
}

export type EnrolmentProtocol = {
  studyInformation?: EnrolmentStudyInformation,
  eligibility: EnrolmentEligibility,
  consent: EnrolmentConsent,
  additional?: EnrolmentAdditional
  account?: EnrolmentAccount,
  version: string
}

export type ArmtSchedule = {};
export type ArmtAppearance = {};
export type ArmtGithubRedcapDefinitionLink = {
  org: string,
  project: string,
  avsc: string,
  name: string
}

type ArmtMetadataBase = {
  title: string,
  description?: string,
  order?: number,
  showInPortal?: boolean
  optional?: boolean
  type: "redcap_github" | "redcap_local" | "inbuilt"
}

interface ArmtMetadataGithub extends ArmtMetadataBase {
  type: "redcap_github"
  definitionLink: ArmtGithubRedcapDefinitionLink
}

interface ArmtMetadataLocal extends ArmtMetadataBase {
  type: "redcap_local"
  path: string
}

export interface ArmtMetadataInbuilt extends ArmtMetadataBase {
  type: "inbuilt"
  inbuiltId: string,
  options: any
}

export type ArmtMetadata = ArmtMetadataGithub | ArmtMetadataInbuilt | ArmtMetadataLocal

export type ArmtProtocol = {
  id: string;
  appearance: ArmtAppearance;
  schedule: ArmtSchedule;
  metadata: ArmtMetadata;
};

export type StudyUiConfig = {
  materialTheme: ThemeOptions;
  studyIconSrc: string;
  navbarLinks: {text: string, href: string}[];
  footer: FooterProps;
  portal: {title: string, content: string}
  analytics: {gaId: string}
};



export type StudyProtocol = {
  name: string;
  studyId: string;
  healthIssues: string[];
  onboarding: Onboarding;
  enrolment: EnrolmentProtocol;
  protocols: ArmtProtocol[];
  studyUiConfig: StudyUiConfig;
}