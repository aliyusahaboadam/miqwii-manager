// File: src/component/promotion/PromotionHistory.jsx
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    getPromotionHistory,
    undoPromotion,
} from '../../redux/reducer/promotionSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from 'react';
import navbar from '../style/dashboard/SchoolDashboard.module.css';

import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    '&:last-child td, &:last-child th': { border: 0 },
}));

const PromotionHistory = () => {

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = React.useState(null);

    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;
    const handleClickAway = () => setAnchorProfile(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const promotionState = useSelector((state) => state.promotion);
    const { history, fetchingStatus, undoingStatus } = promotionState;
    const rows = Array.isArray(history) ? history : [];

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
        dispatch(getPromotionHistory());
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleUndo = async (batchId) => {
        try {
            await dispatch(undoPromotion(batchId)).unwrap();
            setAlertType("success");
            setMessage("Batch undone successfully");
            setOpen(true);
            dispatch(getPromotionHistory());
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || "Undo failed");
            setOpen(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
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
                                    <Typography variant="h4" noWrap>Promotion History</Typography>
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
                                    <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                                        <Table sx={{ minWidth: 1100 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left">S/N</StyledTableCell>
                                                    <StyledTableCell align="left">Executed At</StyledTableCell>
                                                    <StyledTableCell align="left">Source Session</StyledTableCell>
                                                    <StyledTableCell align="left">Target Session</StyledTableCell>
                                                    <StyledTableCell align="left">Mappings</StyledTableCell>
                                                    <StyledTableCell align="left">Promoted</StyledTableCell>
                                                    <StyledTableCell align="left">Graduated</StyledTableCell>
                                                    <StyledTableCell align="left">Status</StyledTableCell>
                                                    <StyledTableCell align="right">Action</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(rowsPerPage > 0
                                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : rows
                                                ).map((row, index) => (
                                                    <StyledTableRow key={row.batchId}>
                                                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                                        <StyledTableCell>{formatDate(row.executedAt)}</StyledTableCell>
                                                        <StyledTableCell>{row.sourceSessionLabel}</StyledTableCell>
                                                        <StyledTableCell>{row.targetSessionLabel}</StyledTableCell>
                                                        <StyledTableCell>
                                                            {(row.items || []).length === 0
                                                                ? <span style={{ color: '#999', fontSize: 14 }}>—</span>
                                                                : (row.items || []).map((it, i) => (
                                                                    <div key={i} style={{ fontSize: 14, marginBottom: 2 }}>
                                                                        <span style={{ color: '#0e387a', fontWeight: 600 }}>{it.sourceClassName}</span>
                                                                        <span style={{ color: '#888' }}> → </span>
                                                                        <span style={{ color: it.graduation ? '#c43e3e' : '#2f7a3a', fontWeight: 600 }}>
                                                                            {it.graduation ? "GRADUATE" : it.targetClassName}
                                                                        </span>
                                                                        <span style={{ color: '#888' }}> ({it.studentCount})</span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </StyledTableCell>
                                                        <StyledTableCell>{row.totalPromoted}</StyledTableCell>
                                                        <StyledTableCell>{row.totalGraduated}</StyledTableCell>
                                                        <StyledTableCell>{row.undone ? "Undone" : "Active"}</StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            {!row.undone && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUndo(row.batchId)}
                                                                    disabled={undoingStatus === 'loading'}
                                                                    style={{
                                                                        padding: "0.5rem 1rem",
                                                                        borderRadius: 8,
                                                                        border: 'none',
                                                                        background: '#c43e3e',
                                                                        color: '#fff',
                                                                        fontSize: 14,
                                                                        fontWeight: 600,
                                                                        cursor: undoingStatus === 'loading' ? 'not-allowed' : 'pointer',
                                                                    }}
                                                                >
                                                                    Undo
                                                                </button>
                                                            )}
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                                                        colSpan={9}
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

export default PromotionHistory;

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