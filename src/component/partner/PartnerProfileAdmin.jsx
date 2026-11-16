// File: src/component/partner/PartnerProfileAdmin.jsx
import EditIcon from '@mui/icons-material/Edit';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { IconButton } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import AdminDrawer from '../utility/drawer/AdminDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';

import {
    getPartnerById,
    getPartnerSchools,
    getPartnerSessions,
    resetStatus,
} from '../../redux/reducer/partnerSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0e387a",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 18 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const PartnerProfileAdmin = () => {
  const { id } = useParams();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (e) => setAnchorProfile(anchorProfile ? null : e.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const partnerState = useSelector((state) => state.partner);
  const {
    partner,
    partnerSchools,
    partnerSessions,
    fetchingStatus,
  } = partnerState;

  const schoolRows = Array.isArray(partnerSchools) ? partnerSchools : [];
  const sessionRows = Array.isArray(partnerSessions) ? partnerSessions : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // -------- pagination state (schools) --------
  const [schoolPage, setSchoolPage] = React.useState(0);
  const [schoolsPerPage, setSchoolsPerPage] = React.useState(100);

  // -------- pagination state (sessions) --------
  const [sessionPage, setSessionPage] = React.useState(0);
  const [sessionsPerPage, setSessionsPerPage] = React.useState(100);

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    if (id) {
      dispatch(getPartnerById(id));
      dispatch(getPartnerSchools(id));
      dispatch(getPartnerSessions(id));
    }
    return () => dispatch(resetStatus());
  }, [id, dispatch]);

  const handleEdit = () => navigate(`/admin/update-partner/${id}`);
  const backToPartners = () => navigate('/admin/partners');

  const handleSchoolChangePage = (event, newPage) => setSchoolPage(newPage);
  const handleSchoolChangeRowsPerPage = (event) => {
    setSchoolsPerPage(parseInt(event.target.value, 10));
    setSchoolPage(0);
  };

  const handleSessionChangePage = (event, newPage) => setSessionPage(newPage);
  const handleSessionChangeRowsPerPage = (event) => {
    setSessionsPerPage(parseInt(event.target.value, 10));
    setSessionPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isLoading = fetchingStatus === 'loading' && !partner;

  return (
    <>
      {isLoading ? (<Loading />) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Navbar */}
            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                  </IconButton>
                )}

                <div>
                  <IconButton
                    onClick={profilePopup}
                    sx={{
                      backgroundColor: "#0e387a",
                      "&:hover": { backgroundColor: "#0c3371" },
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                  </IconButton>

                  <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a href="/school/school-profile" className={navbar['link--profile']}>Profile</a>
                      </div>
                      <div className={navbar['logout']}>
                        <a onClick={logout} className={navbar['link--profile']}>Logout</a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            {/* Drawer */}
            <AdminDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: 8,
                fontSize: 23,
                overflowX: 'auto',
                width: '100%',
                color: '#9a99ac',
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <div className={dashboard['secondary--container']}>

                {/* Top action cards */}
                <div className={[dashboard['grid'], dashboard['grid--1x2']].join(' ')}>
                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>
                        {partner?.partnerName || 'Partner Details'}
                      </div>
                      <button
                        onClick={handleEdit}
                        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
                      >
                        <EditIcon sx={{ fontSize: 18, marginRight: 1 }} />
                        Edit Partner
                      </button>
                    </div>
                  </div>

                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>Go back to partners list</div>
                      <button
                        onClick={backToPartners}
                        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>

                {/* ---------- Partner info card ---------- */}
                {partner && (
                  <Paper
                    sx={{
                      maxWidth: 720,
                      mx: 'auto',
                      mb: 3,
                      p: 3,
                      borderRadius: '15px',
                      background: '#fff',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#0e387a',
                        marginTop: 0,
                        marginBottom: '1rem',
                      }}
                    >
                      Partner Information
                    </p>

                    {partner.logoUrl && (
                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <img
                          src={partner.logoUrl}
                          alt="Partner Logo"
                          style={{
                            maxWidth: 140,
                            maxHeight: 80,
                            borderRadius: 8,
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}

                    <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                      <span>Partner Name:</span>
                      {partner.partnerName}
                    </div>

                    <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                      <span>Location:</span>
                      {partner.location || '—'}
                    </div>

                    <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                      <span>Splitter Code:</span>
                      {partner.splitterCode || '—'}
                    </div>

                    <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                      <span>Email:</span>
                      {partner.userEmail || '—'}
                    </div>

                    <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                      <span>Total Schools:</span>
                      {partner.schoolCount ?? 0}
                    </div>
                  </Paper>
                )}

                {/* ---------- Schools table ---------- */}
                <p style={{ fontSize: 20, fontWeight: 600, color: '#0e387a', margin: '1rem 0.5rem' }}>
                  Schools onboarded by this partner ({schoolRows.length})
                </p>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="partner schools table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">School Name</StyledTableCell>
                        <StyledTableCell align="left">Reg No</StyledTableCell>
                        <StyledTableCell align="left">Contact</StyledTableCell>
                        <StyledTableCell align="left">Address</StyledTableCell>
                        <StyledTableCell align="left">Motto</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(schoolsPerPage > 0
                        ? schoolRows.slice(schoolPage * schoolsPerPage, schoolPage * schoolsPerPage + schoolsPerPage)
                        : schoolRows
                      ).map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.regNo}</StyledTableCell>
                          <StyledTableCell>{row.contact}</StyledTableCell>
                          <StyledTableCell>{row.address}</StyledTableCell>
                          <StyledTableCell>{row.motto}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                      {schoolRows.length === 0 && (
                        <StyledTableRow>
                          <StyledTableCell colSpan={6} align="center">
                            This partner has not onboarded any schools yet.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                          colSpan={6}
                          count={schoolRows.length}
                          rowsPerPage={schoolsPerPage}
                          page={schoolPage}
                          slotProps={{
                            select: {
                              inputProps: { 'aria-label': 'rows per page' },
                              native: true,
                            },
                          }}
                          onPageChange={handleSchoolChangePage}
                          onRowsPerPageChange={handleSchoolChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                          sx={{
                            "& .MuiTablePagination-toolbar": { fontSize: 18 },
                            "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                            "& .MuiTablePagination-input": { fontSize: 18 },
                            "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>

                {/* ---------- Sessions table ---------- */}
                <p style={{ fontSize: 20, fontWeight: 600, color: '#0e387a', margin: '2rem 0.5rem 1rem' }}>
                  Sessions across this partner's schools ({sessionRows.length})
                </p>

                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table sx={{ minWidth: 750 }} aria-label="partner sessions table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">School Name</StyledTableCell>
                        <StyledTableCell align="left">Session</StyledTableCell>
                        <StyledTableCell align="left">Term</StyledTableCell>
                        <StyledTableCell align="left">Current</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="left">Expiry</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(sessionsPerPage > 0
                        ? sessionRows.slice(sessionPage * sessionsPerPage, sessionPage * sessionsPerPage + sessionsPerPage)
                        : sessionRows
                      ).map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.schoolName || '—'}</StyledTableCell>
                          <StyledTableCell>{row.session}</StyledTableCell>
                          <StyledTableCell>{row.term}</StyledTableCell>
                          <StyledTableCell>{row.isCurrent === true ? 'True' : 'False'}</StyledTableCell>
                          <StyledTableCell>{row.status || '—'}</StyledTableCell>
                          <StyledTableCell>{formatDate(row.expiryDate)}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                      {sessionRows.length === 0 && (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7} align="center">
                            No academic sessions exist in this partner's schools yet.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                          colSpan={7}
                          count={sessionRows.length}
                          rowsPerPage={sessionsPerPage}
                          page={sessionPage}
                          slotProps={{
                            select: {
                              inputProps: { 'aria-label': 'rows per page' },
                              native: true,
                            },
                          }}
                          onPageChange={handleSessionChangePage}
                          onRowsPerPageChange={handleSessionChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                          sx={{
                            "& .MuiTablePagination-toolbar": { fontSize: 18 },
                            "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                            "& .MuiTablePagination-input": { fontSize: 18 },
                            "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>

              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default PartnerProfileAdmin;

/* -------------------- Pagination Actions -------------------- */
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
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{ fontSize: 30 }} /> : <KeyboardArrowLeft sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{ fontSize: 30 }} /> : <KeyboardArrowRight sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon sx={{ fontSize: 30 }} /> : <LastPageIcon sx={{ fontSize: 30 }} />}
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