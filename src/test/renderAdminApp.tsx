import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../app/AppProviders';
import { AppRouter } from '../app/AppRouter';

export function renderAdminApp(initialPath = '/') {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRouter />
      </MemoryRouter>
    </AppProviders>,
  );
}
