"use server"

export interface ProjectStatus {
  projectName: string
  acceptingEnrolment: boolean
  tags: string[]
}

export type ProjectStatusResult =
  | { status: 'found', data: ProjectStatus }
  | { status: 'not_found' }

export async function getProjectStatus(projectId: string): Promise<ProjectStatusResult> {
  const baseUrl = process.env.DELEGATE_API_URL
  if (!baseUrl) {
    return { status: 'found', data: { projectName: projectId, acceptingEnrolment: true, tags: [] } }
  }
  try {
    const res = await fetch(`${baseUrl}/projects/${encodeURIComponent(projectId)}/status`, {
      cache: 'no-store',
    })
    if (!res.ok) return { status: 'not_found' }
    return { status: 'found', data: await res.json() as ProjectStatus }
  } catch {
    return { status: 'not_found' }
  }
}
