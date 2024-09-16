import { FooterProps } from "@/app/_ui/components/footer";
import { ThemeOptions } from "@mui/material";

export type OnboardingStep = {};
export type OnboardingMetadata = {};
export type Onboarding = {
  metadata: OnboardingMetadata;
  steps: OnboardingStep[];
};

export type ArmtDefinition = {};
export type ArmtSchedule = {};
export type ArmtAppearance = {};
export type ArmtMetadata = {};
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
  protocols: ArmtProtocol[];
  studyUiConfig: StudyUiConfig;
}