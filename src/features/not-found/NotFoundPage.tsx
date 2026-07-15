import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography component="h1" variant="h4">
        Page not found
      </Typography>
      <Typography color="text.secondary">The requested Admin route does not exist.</Typography>
      <Button component={Link} to="/" variant="contained">
        Return to dashboard
      </Button>
    </Stack>
  );
}
