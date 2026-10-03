// File: src/component/class/CrecheClasses.jsx
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
import {
    deleteClass,
    getClassCount,
    getClassCountByFilter,
    getClassesByFilter
} from '../../redux/reducer/classSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import ActionMenu from '../utility/ActionMenu';
import CirculerProgressLoader from '../utility/CirculerProgressLoader';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import ClassScoreSheet from '../result/ClassScoreSheet';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0e387a",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
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

const CRECHE_FILTER = { section: 'CRECHE' };

const CrecheClasses = () => {

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const profilePopup = (event) => {
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  };

  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;

  const handleClickAway = () => setAnchorProfile(null);

  const classState = useSelector((state) => state.classes);
  const { classNamesSpecific, classCount, classCountSpecific, fetchingStatus } = classState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = false;

  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const fetchData = async () => {
    try {
      setIsInitialLoad(true);
      await Promise.all([
        dispatch(getClassesByFilter(CRECHE_FILTER)).unwrap(),
        dispatch(getClassCount()).unwrap(),
        dispatch(getClassCountByFilter(CRECHE_FILTER)).unwrap()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const rows = Array.isArray(classNamesSpecific) ? classNamesSpecific : [];

  const handleDelete = async (id) => {
    rows.filter(row => row.id !== id);
    await dispatch(deleteClass(id)).unwrap();
  };

  const handleEdit = (name) => {
    navigate(`/class/update-class/${name}`);
  };

  const navigateToAddCrecheClass = () => {
    navigate('/class/add-creche-class');
  };

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
                  <IconButton onClick={profilePopup} sx={{
                    backgroundColor: "#0e387a",
                    "&:hover": { backgroundColor: "#0c3371" }
                  }}>
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

            <SchoolDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

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
                <div className={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>

                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#class"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{classCountSpecific}</span>
                      </div>
                      Available Creche Classes
                    </div>
                  </div>

                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#class"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{classCount}</span>
                      </div>
                      Total Classes
                    </div>
                  </div>

                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>
                        Add Creche Classes
                      </div>
                      <button onClick={navigateToAddCrecheClass} className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}>Add Creche Class</button>
                    </div>
                  </div>

                </div>

                <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                  {
                    isInitialLoad ? (<CirculerProgressLoader />) : (
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Creche Classes</StyledTableCell>
                            <StyledTableCell>Score Sheet</StyledTableCell>
                            <StyledTableCell align="left">No. of student</StyledTableCell>
                            <StyledTableCell align="right">Action&nbsp;</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                          ).map((row) => (
                            <StyledTableRow key={row.id}>
                              <StyledTableCell component="th" scope="row">
                                {row.name}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                {
                                  row === null ? "" : <ClassScoreSheet row={row} />
                                }
                              </StyledTableCell>
                              <StyledTableCell align="left">{row.studentCount}</StyledTableCell>
                              <StyledTableCell align="right">
                                <div>
                                  <ActionMenu
                                    row={row}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                  />
                                </div>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                              colSpan={3}
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
                                "& .MuiTablePagination-toolbar": { fontSize: 18 },
                                "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                                "& .MuiTablePagination-input": { fontSize: 18 },
                                "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                              }}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    )
                  }
                </TableContainer>
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default CrecheClasses;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
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