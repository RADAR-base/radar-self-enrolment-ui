import paprkaTheme from './definitions/paprka';
import defaultTheme from './definitions/default';
import { Theme } from '@mui/material';

export const getStudyTheme = (studyId: string) => {
    switch (studyId) {
        case "paprka":
            return paprkaTheme;
        default:
            return defaultTheme;
    }
}
