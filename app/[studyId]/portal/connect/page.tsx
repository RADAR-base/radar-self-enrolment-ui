"use server"
import { Box, Container } from '@mui/material';
import { DevicesPanel } from '@/app/_ui/portal/devicesPanel';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { allTaskStatus, getExistingTasks } from '@/app/_lib/study/tasks/status';


export default async function Page({ params }: { params: { studyId: string} }) {
  
  async function fetchDeviceStatus(studyId: string): Promise<{[key: string]: boolean} | undefined> {
    const resp = await whoAmI()
    if (resp.status == 200) {
      const oryUser = await resp.json()
      const userId = oryUser['identity']['id']
      if (userId) {
        const data = await getExistingTasks(studyId, userId)
        if ('connect' in data) {
          return data['connect']['answers'] as {[key: string]: boolean}
        }
      }
    }
    return undefined
  }
  
  const deviceStatuses = await fetchDeviceStatus(params.studyId)

  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <DevicesPanel deviceStatuses={deviceStatuses} />
        </Container>
      </Box>
    </main>
  )}