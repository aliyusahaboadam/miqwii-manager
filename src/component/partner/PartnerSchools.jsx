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
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import PartnerDrawer from '../utility/drawer/PartnerDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { getMyPartnerSchools, resetStatus } from '../../redux/reducer/partnerSlice';
import navbar from '../style/dashboard/SchoolDashboard.module.css';

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

const PartnerSchools = () => {
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
  const { partnerSchools, fetchingStatus } = partnerState;
  const rows = Array.isArray(partnerSchools) ? partnerSchools : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    dispatch(getMyPartnerSchools());
    return () => dispatch(resetStatus());
  }, [location.pathname]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {fetchingStatus === 'loading' ? (<Loading />) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                  </IconButton>
                )}
                <div>
                  <IconButton onClick={profilePopup} sx={{ backgroundColor: "#0e387a", "&:hover": { backgroundColor: "#0c3371" } }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                  </IconButton>
                  <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a href="/partner/profile" className={navbar['link--profile']}>Profile</a>
                      </div>
                      <div className={navbar['logout']}>
                        <a onClick={logout} className={navbar['link--profile']}>Logout</a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            <PartnerDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

            <Box
              component="main"
              sx={{
                flexGrow: 1, marginTop: 8, fontSize: 23, overflowX: 'auto',
                width: '100%', color: '#9a99ac', transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <div className={dashboard['secondary--container']}>

                <div className={[dashboard['grid'], dashboard['grid--1x2']].join(' ')}>
                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>My Schools</div>
                      <button
                        onClick={() => navigate('/partner/create-school')}
                        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
                      >
                        Add New School
                      </button>
                    </div>
                  </div>

                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>Go back to dashboard</div>
                      <button
                        onClick={() => navigate('/partner/home')}
                        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>

                <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                  <Table sx={{ minWidth: 650 }}>
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
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
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
                      {rows.length === 0 && (
                        <StyledTableRow>
                          <StyledTableCell colSpan={6} align="center">
                            No schools created yet. Click "Add New School" above.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                          colSpan={6}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{ select: { inputProps: { 'aria-label': 'rows per page' }, native: true } }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
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

export default PartnerSchools;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{ fontSize: 30 }} /> : <KeyboardArrowLeft sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{ fontSize: 30 }} /> : <KeyboardArrowRight sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
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