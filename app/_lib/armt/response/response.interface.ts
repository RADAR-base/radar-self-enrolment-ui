export interface RadarQuestionnaireAnswerSchema {
  questionId: string,
  value: string | number,
  startTime: number,
  endTime: number
}

export interface RadarQuestionnaireSchema {
  projectId: string,
  userId: string,
  sourceId: string,
  name: string,
  version: string,
  time: number,
  timeCompleted: number,
  timeNotification: number,
  answers: RadarQuestionnaireAnswerSchema[]
}

export interface ActiveTaskResponse {
  name: string,
  version: string,
  id: string,
  time: number
  answers: {[key: string]: any}
}