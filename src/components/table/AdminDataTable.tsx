// Cập nhật lại cách import icon chuẩn xác nhất để Vite không bị lỗi
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';

export interface AdminTableColumn<T> {
  id: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
}

export interface AdminTablePagination {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

interface AdminDataTableProps<T> {
  title: string;
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getRowLabel: (row: T) => string;
  status?: 'loading' | 'success' | 'error';
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getDeleteSummary?: (row: T) => string;
  pagination?: AdminTablePagination;
}

export function AdminDataTable<T>({
  title,
  columns,
  rows,
  getRowId,
  getRowLabel,
  status = 'success',
  errorMessage = 'The records could not be loaded.',
  emptyTitle = 'No records found',
  emptyMessage = 'Try changing the current filters or add the first record.',
  onRetry,
  onView,
  onEdit,
  onDelete,
  getDeleteSummary,
  pagination,
}: AdminDataTableProps<T>) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const hasActions = Boolean(onView || onEdit || onDelete);
  const columnSpan = columns.length + (hasActions ? 1 : 0);

  const confirmDelete = () => {
    if (pendingDelete && onDelete) {
      onDelete(pendingDelete);
    }
    setPendingDelete(null);
  };

  return (
    <Paper variant="outlined">
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
      </Box>
      <TableContainer>
        <Table aria-label={title}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.header}
                </TableCell>
              ))}
              {hasActions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' && (
              <TableRow>
                <TableCell colSpan={columnSpan} align="center" sx={{ py: 6 }}>
                  <CircularProgress aria-label="Loading records" size={32} />
                </TableCell>
              </TableRow>
            )}
            {status === 'error' && (
              <TableRow>
                <TableCell colSpan={columnSpan} sx={{ py: 3 }}>
                  <Alert
                    severity="error"
                    action={onRetry ? <Button onClick={onRetry}>Retry</Button> : undefined}
                  >
                    {errorMessage}
                  </Alert>
                </TableCell>
              </TableRow>
            )}
            {status === 'success' && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnSpan} align="center" sx={{ py: 6 }}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontWeight: 700 }}>{emptyTitle}</Typography>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {status === 'success' &&
              rows.map((row) => {
                const label = getRowLabel(row);
                return (
                  <TableRow hover key={getRowId(row)}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell align="right">
                        {onView && (
                          <Tooltip title="View">
                            <IconButton aria-label={`View ${label}`} onClick={() => onView(row)}>
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton aria-label={`Edit ${label}`} onClick={() => onEdit(row)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              aria-label={`Delete ${label}`}
                              onClick={() => setPendingDelete(row)}
                            >
                              <DeleteOutlineRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.count}
          page={pagination.page}
          rowsPerPage={pagination.rowsPerPage}
          rowsPerPageOptions={[pagination.rowsPerPage]}
          onPageChange={(_, page) => pagination.onPageChange(page)}
        />
      )}
      <Dialog open={pendingDelete !== null} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Confirm destructive action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingDelete
              ? (getDeleteSummary?.(pendingDelete) ??
                `Delete ${getRowLabel(pendingDelete)}? This action cannot be undone.`)
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Confirm delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
