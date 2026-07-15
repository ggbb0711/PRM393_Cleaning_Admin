import { ThemeProvider } from '@mui/material';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { cleanAiTheme } from '../../theme/theme';
import { AdminDataTable, type AdminTableColumn } from './AdminDataTable';

interface RecordRow {
  id: string;
  name: string;
}

const rows: RecordRow[] = [{ id: 'record-1', name: 'Record Alpha' }];
const columns: AdminTableColumn<RecordRow>[] = [
  { id: 'name', header: 'Name', render: (row) => row.name },
];

function renderTable(
  overrides: Partial<React.ComponentProps<typeof AdminDataTable<RecordRow>>> = {},
) {
  return render(
    <ThemeProvider theme={cleanAiTheme}>
      <AdminDataTable
        title="Records"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        {...overrides}
      />
    </ThemeProvider>,
  );
}

describe('AdminDataTable', () => {
  it('[UT-WEB-FOUNDATION-002-01] hiển thị dữ liệu, tiêu đề và cột thao tác', () => {
    renderTable({ onView: vi.fn() });

    expect(screen.getByRole('table', { name: 'Records' })).toBeInTheDocument();
    expect(screen.getByText('Record Alpha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Record Alpha' })).toBeInTheDocument();
  });

  it('[UT-WEB-FOUNDATION-002-02] hiển thị trạng thái loading, empty và error rõ ràng', () => {
    const { rerender } = renderTable({ status: 'loading' });
    expect(screen.getByLabelText('Loading records')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={cleanAiTheme}>
        <AdminDataTable
          title="Records"
          columns={columns}
          rows={[]}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.name}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('No records found')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={cleanAiTheme}>
        <AdminDataTable
          title="Records"
          columns={columns}
          rows={[]}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.name}
          status="error"
        />
      </ThemeProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('The records could not be loaded.');
  });

  it('[UT-WEB-FOUNDATION-002-03] chuyển đúng bản ghi cho thao tác xem và sửa', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const onEdit = vi.fn();
    renderTable({ onView, onEdit });

    await user.click(screen.getByRole('button', { name: 'View Record Alpha' }));
    await user.click(screen.getByRole('button', { name: 'Edit Record Alpha' }));

    expect(onView).toHaveBeenCalledWith(rows[0]);
    expect(onEdit).toHaveBeenCalledWith(rows[0]);
  });

  it('[UT-WEB-FOUNDATION-002-04] yêu cầu xác nhận trước khi xóa bản ghi', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderTable({ onDelete });

    await user.click(screen.getByRole('button', { name: 'Delete Record Alpha' }));

    expect(screen.getByRole('dialog', { name: 'Confirm destructive action' })).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Delete Record Alpha' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });

  it('[UT-WEB-FOUNDATION-002-05] chuyển trang bằng callback phân trang', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderTable({
      pagination: { count: 30, page: 0, rowsPerPage: 10, onPageChange },
    });

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
