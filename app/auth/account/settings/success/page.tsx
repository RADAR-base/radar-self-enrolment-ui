import { Alert, AlertTitle, Box, Container, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';

export default function Page() {
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4} display="flex" flexDirection="column" gap={3} textAlign="left">
              <Typography variant="h2">Password updated</Typography>
              <Alert severity="success" variant="outlined">
                <AlertTitle>Success</AlertTitle>
                Your password has been set successfully. You can now close this page
                and return to your original login page to sign in.
              </Alert>
            </Box>
          </RadarCard>
        </Box>
      </Container>
    </main>
  )
}
