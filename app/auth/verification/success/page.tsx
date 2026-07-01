import { Alert, AlertTitle, Box, Container, Typography } from '@mui/material'
import { RadarCard } from '@/app/_ui/components/base/card'

export default function Page() {
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4} display="flex" flexDirection="column" gap={3} textAlign="left">
              <Typography variant="h2">Account verified</Typography>
              <Alert severity="success" variant="outlined">
                <AlertTitle>Success</AlertTitle>
                Your account has been verified successfully.
              </Alert>
            </Box>
          </RadarCard>
        </Box>
      </Container>
    </main>
  )
}
