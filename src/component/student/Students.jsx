// File: src/component/student/Students.jsx
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Alert, IconButton, Snackbar } from "@mui/material";
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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteStudent, getStudentByClass } from '../../redux/reducer/studentSlice';
import Loading from '../Chunks/loading';
import RepeatStudentDialog from '../promotion/RepeatStudentDialog';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';
import StudentActionMenu from '../utility/StudentActionMenu';

import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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

const Students = () => {

    // ---------- Drawer boilerplate ----------
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = React.useState(null);
    const [activeChevron, setActiveChevron] = useState(null);

    const toggleChevron = (chevronId) => setActiveChevron((prev) => (prev === chevronId ? null : chevronId));
    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;
    const handleClickAway = () => setAnchorProfile(null);

    // ---------- Page state ----------
    const studentState = useSelector((state) => state.students);
    const { studentsInClass, fetchingStatus } = studentState;
    const rows = Array.isArray(studentsInClass) ? studentsInClass : [];

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const { className } = useParams();

    const [repeatOpen, setRepeatOpen] = useState(false);
    const [repeatStudent, setRepeatStudent] = useState(null);

    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");

    const authenticated = false;
    const logout = () => {
        localStorage.removeItem('token');
        navigate("/school/login");
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
    };

    useEffect(() => {
        fetchData();
    }, [location.pathname]);

    const fetchData = () => {
        dispatch(getStudentByClass(className));
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteStudent(id)).unwrap();
            setAlertType("success");
            setMessage("Student deleted successfully");
            setOpen(true);
            fetchData();
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || "Delete failed");
            setOpen(true);
        }
    };

    const handleEdit = (id) => {
        navigate(`/student/update-student/${id}/${className}`);
    };

    const handleViewDetails = (id) => {
        navigate(`/student/student-details/${id}`);
    };

    const handleRepeat = (student) => {
        setRepeatStudent(student);
        setRepeatOpen(true);
    };

    const backToStudentsClasses = () => {
        navigate('/student/view-students');
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            {fetchingStatus === 'loading' ? (<Loading />) : (
                <>
                    {/* ClickAwayListener must wrap exactly ONE child.
                        Snackbar + RepeatStudentDialog live OUTSIDE. */}
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ display: "flex" }}>
                            <CssBaseline />

                            {/* Navbar */}
                            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
                                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
                          <SchoolDrawer
    isLargeScreen={isLargeScreen}
    isDrawerOpen={isDrawerOpen}
    toggleDrawer={toggleDrawer}
    logout={logout}
/>

                            {/* Main content */}
                            <Box component="main" sx={{ flexGrow: 1, marginTop: 8, fontSize: 23, overflowX: 'auto', width: '100%', color: '#9a99ac' }}>
                                <div className={dashboard['secondary--container']}>

                                    <div class={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                                        <div class={dashboard['card_body']}>
                                            <div class={dashboard['card--small-head']}>Go back to students classes</div>
                                            <button onClick={backToStudentsClasses} className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}>Back</button>
                                        </div>
                                    </div>

                                    <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left">S/N</StyledTableCell>
                                                    <StyledTableCell align="left">Reg No</StyledTableCell>
                                                    <StyledTableCell align="left">Full name</StyledTableCell>
                                                    <StyledTableCell align="left">Entry Date</StyledTableCell>
                                                    <StyledTableCell align="left">Gender</StyledTableCell>
                                                    <StyledTableCell align="right">Action</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(rowsPerPage > 0
                                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : rows
                                                ).map((row, index) => (
                                                    <StyledTableRow key={row.id}>
                                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                                        <StyledTableCell>{row.regNo}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.firstname + ' ' + row.surname + ' ' + row.lastname}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.entryDate}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.gender}</StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            <StudentActionMenu
                                                                row={row}
                                                                onDelete={handleDelete}
                                                                onEdit={handleEdit}
                                                                onView={handleViewDetails}
                                                                onRepeat={handleRepeat}
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                                                        colSpan={6}
                                                        count={rows.length}
                                                        rowsPerPage={rowsPerPage}
                                                        page={page}
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

                    {/* Repeat student dialog — OUTSIDE ClickAwayListener */}
                    <RepeatStudentDialog
                        open={repeatOpen}
                        student={repeatStudent}
                        className={className}
                        onClose={() => setRepeatOpen(false)}
                        onSuccess={() => {
                            setAlertType("success");
                            setMessage("Student will repeat this class next session");
                            setOpen(true);
                        }}
                    />

                    {/* Snackbar — OUTSIDE ClickAwayListener */}
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%", fontSize: "1.6rem", padding: "16px", textAlign: "center" }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </>
    );
};

export default Students;

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
    const handleBackButtonClick = (event) => onPageChange(event, page - 1);
    const handleNextButtonClick = (event) => onPageChange(event, page + 1);
    const handleLastPageButtonClick = (event) => onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{ fontSize: 30 }} /> : <KeyboardArrowLeft sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{ fontSize: 30 }} /> : <KeyboardArrowRight sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
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