import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon, PersonOutlineOutlined } from '@mui/icons-material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getClassesByFilter } from '../../redux/reducer/classSlice';
import { getReleaseList, updateReleased } from '../../redux/reducer/resultSlice';
import { getAllSchoolSession } from '../../redux/reducer/sessionSlice';
import Loading from '../Chunks/loading';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

// ---------------------------------------------------------------------
// Styled cells
// ---------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0e387a',
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SECTIONS = [
  { value: 'CRECHE', label: 'Creche' },
  { value: 'KG', label: 'KG' },
  { value: 'NURSERY', label: 'Nursery' },
  { value: 'PRIMARY', label: 'Primary' },
  { value: 'SECONDARY', label: 'Secondary' },
];

// ---------------------------------------------------------------------

const ReleaseResults = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/school/login');
    localStorage.setItem('authenticated', JSON.stringify(false));
  };

  // ---------------------------------------------------------------------
  // Redux state
  // ---------------------------------------------------------------------

  const { classNamesSpecific } = useSelector((state) => state.classes);
  const { sessions, fetchingStatus: sessionFetchingStatus } = useSelector((state) => state.sessions);
  const {
    releaseList,
    fetchingStatus,
    updatingStatus,
    error: releaseError,
  } = useSelector((state) => state.results);

  // ---------------------------------------------------------------------
  // Local filter state
  // ---------------------------------------------------------------------

  const [section, setSection] = useState('');
  const [classId, setClassId] = useState('');
  const [sessionId, setSessionId] = useState('');

  // ---------------------------------------------------------------------
  // Selection & pagination
  // ---------------------------------------------------------------------

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // ---------------------------------------------------------------------
  // Alert state
  // ---------------------------------------------------------------------

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    body: '',
    onConfirm: null,
  });

  // ---------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------

  useEffect(() => {
    dispatch(getAllSchoolSession());
  }, [location.pathname, dispatch]);

  // When a section is selected, load its classes.
  useEffect(() => {
    if (section) {
      dispatch(getClassesByFilter({ section }));
    }
  }, [section, dispatch]);

  // Default the session to the current one once sessions load.
  useEffect(() => {
    if (!sessionId && Array.isArray(sessions) && sessions.length > 0) {
      const current = sessions.find((s) => s.current);
      if (current) setSessionId(current.id);
    }
  }, [sessions, sessionId]);

  // Fetch the release list when class + session are both selected.
  useEffect(() => {
    if (classId && sessionId) {
      dispatch(getReleaseList({ classId, sessionId }));
      // reset selection whenever the list is refetched
      setSelectedIds(new Set());
      setPage(0);
    }
  }, [classId, sessionId, dispatch]);

  // Surface redux errors via the alert dialog.
  useEffect(() => {
    if (releaseError && (fetchingStatus === 'failed' || updatingStatus === 'failed')) {
      setAlertType('error');
      setMessage(releaseError);
      setOpen(true);
    }
  }, [releaseError, fetchingStatus, updatingStatus]);

  // ---------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------

  const rows = useMemo(() => (Array.isArray(releaseList) ? releaseList : []), [releaseList]);

  const visibleRows = useMemo(() => {
    if (rowsPerPage > 0) {
      return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return rows;
  }, [rows, page, rowsPerPage]);

  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((r) => selectedIds.has(r.enrollmentId));

  const someVisibleSelected =
    !allVisibleSelected && visibleRows.some((r) => selectedIds.has(r.enrollmentId));

  const selectedCount = selectedIds.size;

  // ---------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRow = (enrollmentId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(enrollmentId)) next.delete(enrollmentId);
      else next.add(enrollmentId);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleRows.forEach((r) => next.delete(r.enrollmentId));
      } else {
        visibleRows.forEach((r) => next.add(r.enrollmentId));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  // -------- update actions --------

  const applyUpdate = async (ids, released) => {
    if (!ids.length) return;
    try {
      const resultAction = await dispatch(
        updateReleased({ enrollmentIds: ids, released })
      ).unwrap();
      setAlertType('success');
      setMessage(resultAction?.data?.message || 'Release status updated');
      setOpen(true);
    } catch (err) {
      // reducer already set state.error; effect above opens the dialog
    }
  };

  const handleToggleOne = (row) => {
    applyUpdate([row.enrollmentId], !row.released);
  };

  const handleBulkRelease = (released) => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setConfirmDialog({
      open: true,
      title: released ? 'Release Results' : 'Unrelease Results',
      body:
        `You are about to ${released ? 'release' : 'unrelease'} ` +
        `${ids.length} result${ids.length === 1 ? '' : 's'}. ` +
        `Continue?`,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        applyUpdate(ids, released);
      },
    });
  };

  const handleReleaseAllInView = () => {
    const ids = visibleRows.filter((r) => !r.released).map((r) => r.enrollmentId);
    if (!ids.length) {
      setAlertType('error');
      setMessage('All students in view are already released.');
      setOpen(true);
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Release All in View',
      body:
        `This will release ${ids.length} result(s) currently in view. ` +
        `Students already released are skipped. Continue?`,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        applyUpdate(ids, true);
      },
    });
  };

  const handleUnreleaseAllInView = () => {
    const ids = visibleRows.filter((r) => r.released).map((r) => r.enrollmentId);
    if (!ids.length) {
      setAlertType('error');
      setMessage('All students in view are already unreleased.');
      setOpen(true);
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Unrelease All in View',
      body:
        `This will unrelease ${ids.length} result(s) currently in view. ` +
        `Students already unreleased are skipped. Continue?`,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        applyUpdate(ids, false);
      },
    });
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  const isLoading =
    sessionFetchingStatus === 'loading' || fetchingStatus === 'loading';

  return (
    <>
      {isLoading && !releaseList.length ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Navbar */}
            <AppBar
              position="fixed"
              sx={{ zIndex: 2, background: 'white', color: '#0e387a' }}
            >
              <Toolbar
                sx={{
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: 'inherit', fontSize: 30 }} />
                  </IconButton>
                )}
                <div>
                  <IconButton
                    onClick={profilePopup}
                    sx={{
                      backgroundColor: '#0e387a',
                      '&:hover': { backgroundColor: '#0c3371' },
                    }}
                  >
                    <PersonOutlineOutlined sx={{ color: 'white', fontSize: 25 }} />
                  </IconButton>
                  <BasePopup
                    sx={{ zIndex: 2 }}
                    id={idProfile}
                    open={openProfile}
                    anchor={anchorProfile}
                  >
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a
                          href="/school/school-profile"
                          className={[navbar['link--profile'], navbar['']].join(' ')}
                        >
                          Profile
                        </a>
                      </div>
                      <div className={navbar['logout']}>
                        <a
                          onClick={logout}
                          className={[navbar['link--profile'], navbar['']].join(' ')}
                        >
                          Logout
                        </a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            {/* Drawer */}
            <SchoolDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

            {/* Main content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: 8,
                fontSize: 23,
                overflowX: 'auto',
                width: '100%',
                color: '#9a99ac',
                transition: 'margin-left 0.3s ease-in-out',
              }}
            >
              <div className={dashboard['secondary--container']}>
                {/* Title card */}
                <div
                  className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}
                >
                  <div className={dashboard['card_body']}>
                    <div className={dashboard['card_button_and_icon']}>
                      <span className={[dashboard['badge'], dashboard['']].join(' ')}>
                        Release Results
                      </span>
                    </div>
                    Control which students can view their results.
                  </div>
                </div>

                {/* Filters */}
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginTop: 20,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel>Section</InputLabel>
                    <Select
                      value={section}
                      label="Section"
                      onChange={(e) => {
                        setSection(e.target.value);
                        setClassId('');
                        clearSelection();
                      }}
                    >
                      {SECTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }} size="small" disabled={!section}>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={classId}
                      label="Class"
                      onChange={(e) => {
                        setClassId(e.target.value);
                        clearSelection();
                      }}
                    >
                      {Array.isArray(classNamesSpecific) &&
                        classNamesSpecific.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 220 }} size="small">
                    <InputLabel>Session / Term</InputLabel>
                    <Select
                      value={sessionId}
                      label="Session / Term"
                      onChange={(e) => {
                        setSessionId(e.target.value);
                        clearSelection();
                      }}
                    >
                      {Array.isArray(sessions) &&
                        sessions.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.session} — {s.term} {s.current ? '(current)' : ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Bulk actions */}
                {classId && sessionId && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      marginTop: 16,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      disabled={selectedCount === 0 || updatingStatus === 'loading'}
                      onClick={() => handleBulkRelease(true)}
                    >
                      Release Selected ({selectedCount})
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={selectedCount === 0 || updatingStatus === 'loading'}
                      onClick={() => handleBulkRelease(false)}
                    >
                      Unrelease Selected ({selectedCount})
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={updatingStatus === 'loading'}
                      onClick={handleReleaseAllInView}
                    >
                      Release All in View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={updatingStatus === 'loading'}
                      onClick={handleUnreleaseAllInView}
                    >
                      Unrelease All in View
                    </Button>
                    {selectedCount > 0 && (
                      <Button size="small" onClick={clearSelection}>
                        Clear selection
                      </Button>
                    )}
                  </div>
                )}

                {/* Table */}
                {classId && sessionId && (
                  <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ minWidth: 720 }} aria-label="release results table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell padding="checkbox">
                            <Checkbox
                              indeterminate={someVisibleSelected}
                              checked={allVisibleSelected}
                              onChange={toggleAllVisible}
                              inputProps={{ 'aria-label': 'select all in view' }}
                            />
                          </StyledTableCell>
                          <StyledTableCell>Reg No</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Class</StyledTableCell>
                          <StyledTableCell align="center">Released</StyledTableCell>
                          <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {visibleRows.length === 0 && (
                          <StyledTableRow>
                            <StyledTableCell colSpan={6} align="center">
                              No students found for this class and session.
                            </StyledTableCell>
                          </StyledTableRow>
                        )}

                        {visibleRows.map((row) => (
                          <StyledTableRow key={row.enrollmentId}>
                            <StyledTableCell padding="checkbox">
                              <Checkbox
                                checked={selectedIds.has(row.enrollmentId)}
                                onChange={() => toggleRow(row.enrollmentId)}
                                inputProps={{ 'aria-label': `select ${row.regNo}` }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>{row.regNo}</StyledTableCell>
                            <StyledTableCell>{row.fullName}</StyledTableCell>
                            <StyledTableCell>{row.className}</StyledTableCell>
                            <StyledTableCell align="center">
                              <span
                                style={{
                                  color: row.released ? '#1f7a1f' : '#a94442',
                                  fontWeight: 600,
                                }}
                              >
                                {row.released ? 'Released' : 'Not Released'}
                              </span>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                size="small"
                                variant={row.released ? 'outlined' : 'contained'}
                                disabled={updatingStatus === 'loading'}
                                onClick={() => handleToggleOne(row)}
                              >
                                {row.released ? 'Unrelease' : 'Release'}
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>

                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[50, 100, 200, { label: 'All', value: -1 }]}
                            colSpan={6}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                              select: {
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                              },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            sx={{
                              '& .MuiTablePagination-toolbar': { fontSize: 16 },
                              '& .MuiTablePagination-selectLabel': { fontSize: 14 },
                              '& .MuiTablePagination-input': { fontSize: 16 },
                              '& .MuiTablePagination-displayedRows': { fontSize: 14 },
                            }}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                )}

                {/* Empty state before filters are picked */}
                {(!classId || !sessionId) && (
                  <div
                    style={{
                      marginTop: 24,
                      padding: 24,
                      background: '#f4f6fb',
                      border: '1px solid #d6dcea',
                      borderRadius: 6,
                      color: '#4a4a4a',
                      fontSize: 16,
                    }}
                  >
                    Choose a section, class, and session above to see the release list.
                  </div>
                )}
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}

      {/* Alert dialog — success / error */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            BackdropProps={{
              sx: { backgroundColor: 'rgba(157, 152, 202, 0.5)' },
            }}
            sx={{ '& .MuiDialog-paper': { width: '100%', borderRadius: '15px' } }}
          >
            {alertType === 'success' ? (
              <div
                style={{ width: '100%', background: '#fff' }}
                className={[dashboard['card--alert-success']].join(' ')}
              >
                <div className={dashboard['card_body']}>
                  <span
                    className={[
                      dashboard['icon-container'],
                      dashboard['alert-close'],
                    ].join(' ')}
                  >
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg
                      className={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}
                    >
                      <use href="/images/sprite.svg#success-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>success</p>
              </div>
            ) : (
              <div
                style={{ width: '100%', background: '#fff' }}
                className={[dashboard['card--alert-error']].join(' ')}
              >
                <div className={dashboard['card_body']}>
                  <span
                    className={[
                      dashboard['icon-container'],
                      dashboard['alert-close'],
                    ].join(' ')}
                  >
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg
                      className={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}
                    >
                      <use href="/images/sprite.svg#error-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>error</p>
              </div>
            )}
          </Dialog>
        </div>
      </Snackbar>

      {/* Confirm dialog — bulk actions only */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      >
        <Box sx={{ p: 3, minWidth: 360 }}>
          <h3 style={{ marginTop: 0 }}>{confirmDialog.title}</h3>
          <p style={{ color: '#4a4a4a' }}>{confirmDialog.body}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (confirmDialog.onConfirm) confirmDialog.onConfirm();
              }}
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Dialog>
    </>
  );
};

export default ReleaseResults;

// ---------------------------------------------------------------------
// TablePaginationActions
// ---------------------------------------------------------------------

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? (
          <LastPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <LastPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};