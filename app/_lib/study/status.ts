"use server"

type StudyStatus = 'enrolled' | 'active' | 'complete'

export async function getStudyStatus(studyId: string, userId: string) {
  const r = await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    }
  })
  const data = (await r.json())['metadata_admin']
  if ((data == null) || (data['study'] == undefined) || (data['study'][studyId] == undefined))  {
    return undefined
  }

  const status = ('status' in data['study'][studyId]) ?
    data['study'][studyId]['status'] as StudyStatus : 
    undefined
  return status
}

export async function setStudyStatus(studyId: string, userId: string, status: StudyStatus) {
  console.log('setting status:', status)
  return await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      op: 'add',
      path: '/metadata_admin/study/' + studyId + '/' + 'status',
      value: status.toString()
    }])
  })
  
}