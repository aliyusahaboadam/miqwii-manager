// File: src/component/graduation/SelectiveGraduation.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import { graduateSelected } from '../../redux/reducer/graduationSlice';
import { getAllSchoolSession } from '../../redux/reducer/sessionSlice';
import Loading from '../Chunks/loading';
import api from '../routing/Interceptor';
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
    [theme.breakpoints.up('sm')]: { maxWidth: '900px' },
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

const SelectiveGraduation = () => {

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

    const [sourceSessionId, setSourceSessionId] = useState("");
    const [sourceClassId, setSourceClassId] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
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
    }, []);

    useEffect(() => {
        if (!Array.isArray(sessions) || sessions.length === 0) return;
        const current = sessions.find((s) => s.current);
        if (current && !sourceSessionId) setSourceSessionId(current.id);
    }, [sessions]);

    useEffect(() => {
        let cancelled = false;
        if (!sourceClassId || !sourceSessionId) {
            setStudents([]);
            setSelectedIds([]);
            return;
        }
        setStudentsLoading(true);
        const token = localStorage.getItem('token');
        api.get(
            `${import.meta.env.VITE_API_URL}/v1/api/student/students-by-class-and-session`,
            {
                params: { classId: sourceClassId, sessionId: sourceSessionId },
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            }
        ).then((response) => {
            if (cancelled) return;
            setStudents(response.data || []);
            setSelectedIds([]);
        }).catch((error) => {
            console.error('Failed to fetch students', error);
            setStudents([]);
        }).finally(() => {
            if (!cancelled) setStudentsLoading(false);
        });
        return () => { cancelled = true; };
    }, [sourceClassId, sourceSessionId]);

    const allClasses = Array.isArray(classes) ? classes : [];

    const sessionLabel = (s) =>
        s ? `${s.session} – ${s.term}${s.current ? " (current)" : ""}` : "";

    const toggleStudent = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedIds.length === students.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map((s) => s.id));
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const previewList = useMemo(() => {
        return students.filter((s) => selectedIds.includes(s.id));
    }, [students, selectedIds]);

    const canSubmit =
        sourceSessionId &&
        sourceClassId &&
        selectedIds.length > 0;

    const handlePreview = () => {
        if (!sourceSessionId) { setAlertType("error"); setMessage("Select source session"); setOpen(true); return; }
        if (!sourceClassId) { setAlertType("error"); setMessage("Select class"); setOpen(true); return; }
        if (selectedIds.length === 0) { setAlertType("error"); setMessage("Select at least one student"); setOpen(true); return; }
        setPreviewOpen(true);
    };

    const confirmGraduate = async () => {
        setPreviewOpen(false);
        try {
            const result = await dispatch(graduateSelected({
                sourceSessionId: Number(sourceSessionId),
                sourceClassId: Number(sourceClassId),
                studentIds: selectedIds,
            })).unwrap();
            setAlertType("success");
            setMessage(result.message || "Students graduated");
            setOpen(true);
            setSelectedIds([]);
            setSourceClassId("");
            setTimeout(() => setSourceClassId(Number(sourceClassId)), 100);
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || "Graduation failed");
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
                                    <Typography variant="h4" noWrap>Selective Graduation</Typography>
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
                                        <p className={style['form-header']}>Selective Graduation</p>

                                        <div style={{ fontSize: 13, color: '#6b7a99' }}>
                                            Graduate only the students you select. The rest stay enrolled.
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 8 }}>
                                            <div style={{ flex: 1, minWidth: 240 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Source Session</label>
                                                <select
                                                    value={sourceSessionId}
                                                    onChange={(e) => {
                                                        setSourceSessionId(e.target.value);
                                                        setSelectedIds([]);
                                                    }}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select source session</option>
                                                    {(sessions || []).map((s) => (
                                                        <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 240 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Class</label>
                                                <select
                                                    value={sourceClassId}
                                                    onChange={(e) => setSourceClassId(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select class</option>
                                                    {allClasses.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {sourceClassId && sourceSessionId && (
                                            <div style={{ marginTop: 16 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 8,
                                                }}>
                                                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0e387a' }}>
                                                        Students in this class for the source session
                                                    </div>
                                                    {students.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={toggleAll}
                                                            style={{
                                                                background: 'transparent',
                                                                border: '1px solid #0e387a',
                                                                color: '#0e387a',
                                                                borderRadius: 6,
                                                                padding: '4px 10px',
                                                                fontSize: 13,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {selectedIds.length === students.length ? 'Unselect all' : 'Select all'}
                                                        </button>
                                                    )}
                                                </div>

                                                {studentsLoading ? (
                                                    <div style={{ padding: 20, textAlign: 'center', color: '#6b7a99' }}>Loading students…</div>
                                                ) : students.length === 0 ? (
                                                    <div style={{
                                                        padding: 16,
                                                        background: '#f9f9f9',
                                                        borderRadius: 8,
                                                        color: '#6b7a99',
                                                        fontSize: 14,
                                                    }}>
                                                        No students found in this class for the selected session.
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        maxHeight: 380,
                                                        overflowY: 'auto',
                                                        border: '1px solid #e5e5e5',
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        background: '#fff',
                                                    }}>
                                                        {students.map((s) => (
                                                            <label
                                                                key={s.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '6px 10px',
                                                                    borderRadius: 6,
                                                                    cursor: 'pointer',
                                                                    fontSize: 15,
                                                                    background: selectedIds.includes(s.id) ? '#f0f6ff' : 'transparent',
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIds.includes(s.id)}
                                                                    onChange={() => toggleStudent(s.id)}
                                                                    style={{ marginRight: 10, width: 18, height: 18 }}
                                                                />
                                                                <span style={{ fontWeight: 600, marginRight: 10, color: '#0e387a', minWidth: 120 }}>
                                                                    {s.regNo}
                                                                </span>
                                                                <span>
                                                                    {s.firstname} {s.surname} {s.lastname}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                <div style={{ marginTop: 8, fontSize: 14, color: '#6b7a99' }}>
                                                    Selected: <strong>{selectedIds.length}</strong> of {students.length}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handlePreview}
                                            disabled={!canSubmit}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            Preview Graduation
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

                    <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ fontSize: 20, fontWeight: 700 }}>
                            Confirm Selective Graduation
                        </DialogTitle>
                        <DialogContent>
                            <div style={{ fontSize: 15, marginBottom: 12 }}>
                                You are about to graduate <strong>{selectedIds.length}</strong> student(s).
                                This cannot be undone.
                            </div>
                            <div style={{
                                maxHeight: 300,
                                overflowY: 'auto',
                                border: '1px solid #e5e5e5',
                                borderRadius: 8,
                                padding: 8,
                                background: '#f9f9f9',
                            }}>
                                {previewList.map((s) => (
                                    <div key={s.id} style={{ fontSize: 14, padding: '4px 8px' }}>
                                        <strong style={{ color: '#0e387a', marginRight: 8 }}>{s.regNo}</strong>
                                        {s.firstname} {s.surname} {s.lastname}
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                    background: '#fff',
                                    fontSize: 14,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmGraduate}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: '#c43e3e',
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginLeft: 8,
                                }}
                            >
                                Confirm Graduation
                            </button>
                        </DialogActions>
                    </Dialog>

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

export default SelectiveGraduation;