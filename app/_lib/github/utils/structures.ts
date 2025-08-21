export type Project = {
  projectName: string
  description?: string
  sourceTypes: SourceType[]
}

export type SourceType = {
  id: number
  model?: string
  producer?: string
  catalogVersion?: string
}
