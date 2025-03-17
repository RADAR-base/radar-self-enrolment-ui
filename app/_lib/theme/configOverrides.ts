import { RadarBlockCardClassKey, RadarBlockCardProps } from "@/app/_ui/components/base/blockCard";
import { RadarCardClassKey, RadarCardProps } from "@/app/_ui/components/base/card";
import { Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

declare module "@mui/material/styles" {
  interface Components {
    RadarCard?: {
      defaultProps?: RadarCardProps;
      styleOverrides?: Partial<
        OverridesStyleRules<RadarCardClassKey, "RadarCard", Theme>
      >;
    },
    RadarBlockCard?: {
      defaultProps?: RadarBlockCardProps,
      styleOverrides?: Partial<OverridesStyleRules<RadarBlockCardClassKey, "RadarBlockCard", Theme>>;
    }
  }
}