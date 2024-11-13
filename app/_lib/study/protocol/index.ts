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

export type EligabilityItem = IYesNoItem
export type ConsentItem = IYesNoItem

export type EnrolmentStudyInformation = {
  title?: string,
  content?: string
};

export type EnrolmentEligability = {
  title?: string,
  description?: string,
  items: EligabilityItem[]
}


export type EnrolmentConsent = {
  title?: string,
  description?: string,
  requiredItems: ConsentItem[],
  optionalItems?: ConsentItem[],
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
  eligability: EnrolmentEligability,
  consent: EnrolmentConsent,
  additional?: EnrolmentAdditional
  account?: EnrolmentAccount
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
  type: "redcap" | "inbuilt"
}

interface ArmtMetadataGithub extends ArmtMetadataBase {
  type: "redcap"
  definitionLink: ArmtGithubRedcapDefinitionLink
}

interface ArmtMetadataInbuilt extends ArmtMetadataBase {
  type: "inbuilt"
}

export type ArmtMetadata = ArmtMetadataGithub | ArmtMetadataInbuilt

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