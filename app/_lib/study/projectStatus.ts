"use server"

export interface ProjectStatus {
  projectName: string
  acceptingEnrolment: boolean
  tags: string[]
}

export async function getProjectStatus(projectId: string): Promise<ProjectStatus | null> {
  const baseUrl = process.env.DELEGATE_API_URL
  if (!baseUrl) {
    // If delegate API is not configured, allow enrolment by default
    return null
  }
  try {
    const res = await fetch(`${baseUrl}/projects/${encodeURIComponent(projectId)}/status`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json() as ProjectStatus
  } catch {
    return null
  }
}
