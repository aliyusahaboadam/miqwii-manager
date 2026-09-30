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
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getGraduatedStudents } from '../../redux/reducer/graduationSlice';
import Loading from '../Chunks/loading';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    Typography
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

const GraduatedStudents = () => {

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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const graduationState = useSelector((state) => state.graduation);
    const { graduatedStudents, fetchingStatus } = graduationState;
    const allRows = Array.isArray(graduatedStudents) ? graduatedStudents : [];

    const [classFilter, setClassFilter] = useState('');
    const [sessionFilter, setSessionFilter] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);

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
        dispatch(getGraduatedStudents());
    }, []);

    const classOptions = useMemo(() => {
        const seen = new Map();
        allRows.forEach((row) => {
            const key = row.classId != null ? String(row.classId) : row.className;
            if (key && !seen.has(key)) {
                seen.set(key, { value: key, label: row.className || key });
            }
        });
        return Array.from(seen.values()).sort((a, b) =>
            a.label.localeCompare(b.label)
        );
    }, [allRows]);

    const sessionOptions = useMemo(() => {
        const seen = new Map();
        allRows.forEach((row) => {
            const key = row.academicSessionId != null
                ? String(row.academicSessionId)
                : row.academicSessionLabel;
            if (key && !seen.has(key)) {
                seen.set(key, {
                    value: key,
                    label: row.academicSessionLabel || key,
                });
            }
        });
        return Array.from(seen.values()).sort((a, b) =>
            b.label.localeCompare(a.label)
        );
    }, [allRows]);

    const rows = useMemo(() => {
        return allRows.filter((row) => {
            if (classFilter) {
                const key = row.classId != null ? String(row.classId) : row.className;
                if (key !== classFilter) return false;
            }
            if (sessionFilter) {
                const key = row.academicSessionId != null
                    ? String(row.academicSessionId)
                    : row.academicSessionLabel;
                if (key !== sessionFilter) return false;
            }
            return true;
        });
    }, [allRows, classFilter, sessionFilter]);

    useEffect(() => {
        setPage(0);
    }, [classFilter, sessionFilter]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clearFilters = () => {
        setClassFilter('');
        setSessionFilter('');
    };

    const hasActiveFilter = classFilter !== '' || sessionFilter !== '';

    return (
        <>
            {fetchingStatus === 'loading' ? (<Loading />) : (
                <>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ display: "flex" }}>
                            <CssBaseline />

                            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
                                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                                    {!isLargeScreen && (
                                        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                                            <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                                        </IconButton>
                                    )}
                                    <Typography variant="h4" noWrap>Graduated Students</Typography>
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

                            <SchoolDrawer
                                isLargeScreen={isLargeScreen}
                                isDrawerOpen={isDrawerOpen}
                                toggleDrawer={toggleDrawer}
                                logout={logout}
                            />

                            <Box component="main" sx={{ flexGrow: 1, marginTop: 8, fontSize: 20, overflowX: 'auto', width: '100%' }}>
                                <div className={dashboard['secondary--container']}>

                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-end',
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        background: '#f4f9ff',
                                        border: '1px solid #c7d8f5',
                                        borderRadius: 10,
                                    }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a', display: 'block', marginBottom: 4 }}>
                                                Filter by Class
                                            </label>
                                            <select
                                                value={classFilter}
                                                onChange={(e) => setClassFilter(e.target.value)}
                                                style={{ width: '100%', fontSize: 15, padding: '8px 10px', borderRadius: 8 }}
                                            >
                                                <option value="">All Classes</option>
                                                {classOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a', display: 'block', marginBottom: 4 }}>
                                                Filter by Session
                                            </label>
                                            <select
                                                value={sessionFilter}
                                                onChange={(e) => setSessionFilter(e.target.value)}
                                                style={{ width: '100%', fontSize: 15, padding: '8px 10px', borderRadius: 8 }}
                                            >
                                                <option value="">All Sessions</option>
                                                {sessionOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {hasActiveFilter && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                style={{
                                                    background: '#0e387a',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 8,
                                                    padding: '10px 16px',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                Clear Filters
                                            </button>
                                        )}

                                        <div style={{ fontSize: 14, color: '#6b7a99', marginLeft: 'auto' }}>
                                            Showing <strong>{rows.length}</strong> of <strong>{allRows.length}</strong> graduates
                                        </div>
                                    </div>

                                    {rows.length === 0 ? (
                                        <div style={{
                                            padding: '3rem 1rem',
                                            textAlign: 'center',
                                            color: '#6b7a99',
                                            fontSize: 16,
                                            background: '#fff',
                                            borderRadius: 10,
                                        }}>
                                            {hasActiveFilter
                                                ? 'No graduated students match the selected filters.'
                                                : 'No graduated students recorded yet.'}
                                        </div>
                                    ) : (
                                        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                                            <Table sx={{ minWidth: 800 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="left">S/N</StyledTableCell>
                                                        <StyledTableCell align="left">Reg No</StyledTableCell>
                                                        <StyledTableCell align="left">Full Name</StyledTableCell>
                                                        <StyledTableCell align="left">Gender</StyledTableCell>
                                                        <StyledTableCell align="left">Class</StyledTableCell>
                                                        <StyledTableCell align="left">Session</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(rowsPerPage > 0
                                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : rows
                                                    ).map((row, index) => (
                                                        <StyledTableRow key={row.id}>
                                                            <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                                            <StyledTableCell>{row.studentRegNo}</StyledTableCell>
                                                            <StyledTableCell>{row.studentFullName}</StyledTableCell>
                                                            <StyledTableCell>{row.gender}</StyledTableCell>
                                                            <StyledTableCell>{row.className}</StyledTableCell>
                                                            <StyledTableCell>{row.academicSessionLabel}</StyledTableCell>
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
                                    )}
                                </div>
                            </Box>
                        </Box>
                    </ClickAwayListener>

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

export default GraduatedStudents;

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