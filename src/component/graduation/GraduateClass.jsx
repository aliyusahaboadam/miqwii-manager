// File: src/component/graduation/GraduateClass.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import {
    clearGraduationPreview,
    executeGraduation,
    previewGraduation,
} from '../../redux/reducer/graduationSlice';
import { getAllSchoolSession } from '../../redux/reducer/sessionSlice';
import Loading from '../Chunks/loading';
import style from '../style/form/StudentRegistration.module.css';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from 'react';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    borderRadius: '10px',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: { maxWidth: '800px' },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'rgba(10, 40, 89)',
    backgroundSize: 'cover',
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

const GraduateClass = () => {

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

    const sessionState = useSelector((state) => state.sessions);
    const { sessions, fetchingStatus: sessionFetchingStatus } = sessionState;

    const classState = useSelector((state) => state.classes);
    const { classes, fetchingStatus: classFetchingStatus } = classState;

    const graduationState = useSelector((state) => state.graduation);
    const { executingStatus } = graduationState;

    const [sourceSessionId, setSourceSessionId] = useState("");
    const [selectedClassIds, setSelectedClassIds] = useState([]);

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
        dispatch(clearGraduationPreview());
    }, []);

    // Prefill source session to the current one
    useEffect(() => {
        if (!Array.isArray(sessions) || sessions.length === 0) return;
        const current = sessions.find((s) => s.current);
        if (current && !sourceSessionId) {
            setSourceSessionId(current.id);
        }
    }, [sessions]);

    const allClasses = Array.isArray(classes) ? classes : [];

    const toggleClass = (classId) => {
        setSelectedClassIds((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId]
        );
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleGraduate = async () => {
        if (!sourceSessionId) {
            setAlertType("error");
            setMessage("Select the source session");
            setOpen(true);
            return;
        }
        if (selectedClassIds.length === 0) {
            setAlertType("error");
            setMessage("Select at least one class to graduate");
            setOpen(true);
            return;
        }

        // Graduation has no target — students simply end their enrollment.
        const requestBody = {
            sourceSessionId,
            targetSessionId: null,
            mappings: selectedClassIds.map((classId) => ({
                sourceClassId: classId,
                targetClassId: null,
                graduate: true,
            })),
        };

        try {
            await dispatch(previewGraduation(requestBody)).unwrap();
            const result = await dispatch(executeGraduation(requestBody)).unwrap();
            setAlertType("success");
            setMessage(result.message || "Graduation executed");
            setOpen(true);
            setTimeout(() => navigate("/graduation/graduated-students"), 1200);
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
                                    <Typography variant="h4" noWrap>Graduate a Class</Typography>
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
                                        <p className={style['form-header']}>Graduate a Class</p>

                                        {/* Source session only — graduation is terminal */}
                                        <FormControl fullWidth sx={{ mt: 1 }}>
                                            <InputLabel sx={{ fontSize: 16 }}>Source Session</InputLabel>
                                            <Select
                                                value={sourceSessionId}
                                                onChange={(e) => setSourceSessionId(e.target.value)}
                                                variant="filled"
                                                sx={{ fontSize: 16 }}
                                            >
                                                {(sessions || []).map((s) => (
                                                    <MenuItem key={s.id} value={s.id} sx={{ fontSize: 16 }}>
                                                        {s.session} – {s.term} {s.current ? "(current)" : ""}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* Class picker */}
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <p style={{ fontSize: 16, fontWeight: 600, color: '#0e387a', marginBottom: '0.5rem' }}>
                                                Select classes to graduate
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
                                                {allClasses.map((c) => {
                                                    const selected = selectedClassIds.includes(c.id);
                                                    return (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => toggleClass(c.id)}
                                                            style={{
                                                                padding: '0.7rem 1rem',
                                                                borderRadius: 8,
                                                                border: selected ? '2px solid #0e387a' : '1px solid #ccc',
                                                                background: selected ? '#0e387a' : '#fff',
                                                                color: selected ? '#fff' : '#333',
                                                                fontSize: 15,
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleGraduate}
                                            disabled={executingStatus === 'loading'}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: '2rem' }}
                                        >
                                            {executingStatus === 'loading' ? 'Graduating...' : 'Graduate Selected Classes'}
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

                    {/* Snackbar lives OUTSIDE ClickAwayListener */}
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

export default GraduateClass;