import paprkaTheme from './definitions/paprka';
import defaultTheme from './definitions/default';

export const getStudyTheme = (studyId: string) => {
    switch (studyId) {
        case "paprka":
            return paprkaTheme;
        default:
            return defaultTheme;
    }
}
