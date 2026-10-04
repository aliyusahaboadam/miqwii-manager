// File: src/component/attendance/AttendanceExport.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    clearRange,
    exportAttendance,
    fetchAttendanceRange,
} from '../../redux/reducer/attendanceSlice';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import { getAllSchoolSession } from '../../redux/reducer/sessionSlice';
import Loading from '../Chunks/loading';
import style from '../style/form/StudentRegistration.module.css';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import {
    AppBar, Box, CssBaseline, IconButton, Toolbar, Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    borderRadius: '10px',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: { maxWidth: '700px' },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'rgba(10, 40, 89)',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    },
}));

const AttendanceExport = () => {

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

    const sessionState = useSelector((state) => state.sessions);
    const { sessions, fetchingStatus: sessionFetchingStatus } = sessionState;

    const classState = useSelector((state) => state.classes);
    const { classes, fetchingStatus: classFetchingStatus } = classState;

    const attendanceState = useSelector((state) => state.attendance);
    const { exportingStatus } = attendanceState;

    const [sessionId, setSessionId] = useState("");
    const [classId, setClassId] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

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
        dispatch(getAllSchoolSession());
        dispatch(getAllClassnameAndId());
    }, [dispatch]);

    useEffect(() => {
        if (!Array.isArray(sessions) || sessions.length === 0) return;
        const current = sessions.find((s) => s.current);
        if (current && !sessionId) setSessionId(current.id);
    }, [sessions, sessionId]);

    // Auto-fill from/to when session changes
    useEffect(() => {
        if (!sessionId) {
            dispatch(clearRange());
            setFrom("");
            setTo("");
            return;
        }
        dispatch(fetchAttendanceRange(sessionId)).then((result) => {
            if (result.payload?.hasData) {
                setFrom(result.payload.from);
                setTo(result.payload.to);
            } else {
                setFrom("");
                setTo("");
            }
        });
    }, [sessionId, dispatch]);

    const allClasses = Array.isArray(classes) ? classes : [];

    const sessionLabel = (s) =>
        s ? `${s.session} – ${s.term}${s.current ? " (current)" : ""}` : "";

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleDownload = async () => {
        if (!sessionId) { setAlertType('error'); setMessage('Select a session'); setOpen(true); return; }
        if (!from || !to) { setAlertType('error'); setMessage('Select a date range'); setOpen(true); return; }
        if (new Date(from) > new Date(to)) { setAlertType('error'); setMessage('From date must be before To date'); setOpen(true); return; }

        try {
            const result = await dispatch(exportAttendance({
                sessionId,
                classId: classId || null,
                from,
                to,
            })).unwrap();

            const blob = new Blob([result.blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `attendance-${from}-to-${to}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setAlertType('success');
            setMessage('Download started');
            setOpen(true);
        } catch (error) {
            setAlertType('error');
            setMessage('Failed to download. Try a smaller date range.');
            setOpen(true);
        }
    };

    const isLoading = sessionFetchingStatus === 'loading' || classFetchingStatus === 'loading';

    return (
        <>
            {isLoading ? (<Loading />) : (
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
                                    <Typography variant="h4" noWrap>Attendance Export</Typography>
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
                                <SignInContainer>
                                    <Card>
                                        <p className={style['form-header']}>Download Attendance Record</p>

                                        <div style={{ fontSize: 14, color: '#6b7a99' }}>
                                            Choose a session, an optional class, and a date range.
                                            The dates auto-fill to cover the session's attendance.
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 12 }}>
                                            <div style={{ flex: 1, minWidth: 260 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Session</label>
                                                <select
                                                    value={sessionId}
                                                    onChange={(e) => setSessionId(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select session</option>
                                                    {(sessions || []).map((s) => (
                                                        <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div style={{ flex: 1, minWidth: 260 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Class (optional)</label>
                                                <select
                                                    value={classId}
                                                    onChange={(e) => setClassId(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">All classes</option>
                                                    {allClasses.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 8 }}>
                                            <div style={{ flex: 1, minWidth: 200 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>From</label>
                                                <input
                                                    type="date"
                                                    value={from}
                                                    onChange={(e) => setFrom(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4, border: '1px solid #ccc' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 200 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>To</label>
                                                <input
                                                    type="date"
                                                    value={to}
                                                    onChange={(e) => setTo(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4, border: '1px solid #ccc' }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleDownload}
                                            disabled={exportingStatus === 'loading'}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: 16 }}
                                        >
                                            {exportingStatus === 'loading' ? 'Downloading...' : 'Download CSV'}
                                        </button>
                                    </Card>

                                    <div className={style.footer__brand}>
                                        <img src="/images/logo.png" alt="" />
                                        <p className={style.footer__copyright}> (c) 2026 Miqwii, All Rights Reserved</p>
                                    </div>
                                </SignInContainer>
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

export default AttendanceExport;