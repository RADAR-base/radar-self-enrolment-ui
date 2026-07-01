"use client"
import { withBasePath } from "@/app/_lib/util/links"
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"

interface NotEnrolledProps {
  studyId: string
  projects: { id: string; name: string }[]
}

export function NotEnrolled({ studyId, projects }: NotEnrolledProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch(withBasePath("/api/auth/logout"))
    router.push(`/${studyId}/login`)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={3}>
        <Alert severity="warning" variant="outlined">
          <AlertTitle>Not enrolled in this study</AlertTitle>
          Your account is not associated with the study{" "}
          <strong>{studyId}</strong>. You may be signed into the wrong account,
          or you have not yet enrolled in this study.
        </Alert>

        {projects.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Your enrolled studies
            </Typography>
            <List disablePadding>
              {projects.map((project) => (
                <ListItem key={project.id} disablePadding>
                  <ListItemButton
                    href={withBasePath(`/${project.id}/portal`)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={project.name}
                      secondary={project.id}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Sign out
          </Button>
          <Button
            variant="outlined"
            href={withBasePath(`/${studyId}/enrol`)}
          >
            Enrol in this study
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
