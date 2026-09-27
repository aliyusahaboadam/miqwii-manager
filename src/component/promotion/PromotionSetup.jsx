// File: src/component/promotion/PromotionSetup.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import {
    clearPromotionPreview,
    previewPromotion,
} from '../../redux/reducer/promotionSlice';
import { getAllSchoolSession } from '../../redux/reducer/sessionSlice';
import Loading from '../Chunks/loading';
import style from '../style/form/StudentRegistration.module.css';
import PromotionMappingRow from './PromotionMappingRow';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    Toolbar,
    Typography,
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
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='251' height='251' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%230E387A' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3C/g%3E%3Cg fill='%230E387A'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3C/g%3E%3C/svg%3E");`,
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
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
}));

const PromotionSetup = () => {

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
    const [targetSessionId, setTargetSessionId] = useState("");
    const [mappings, setMappings] = useState([]);

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
        dispatch(clearPromotionPreview());
    }, []);

    // -------------------------------------------------------------
    // Determine source and target defaults when sessions load.
    //
    // Promotion goes FORWARD in time:
    //   source = most recent NON-current session (the one students just finished)
    //   target = the current session (the one they're moving into)
    //
    // Sessions are ordered by id ascending (oldest first) — sort by the
    // numeric prefix of `session` to be safe.
    // -------------------------------------------------------------
    useEffect(() => {
        if (!Array.isArray(sessions) || sessions.length === 0) return;

        const sorted = [...sessions].sort((a, b) => {
            const ay = parseInt((a.session || "").split(/[/\-]/)[0], 10) || 0;
            const by = parseInt((b.session || "").split(/[/\-]/)[0], 10) || 0;
            if (ay !== by) return ay - by;
            const order = { "1st": 1, "2nd": 2, "3rd": 3, "first": 1, "second": 2, "third": 3 };
            const at = order[(a.term || "").toLowerCase()] || 0;
            const bt = order[(b.term || "").toLowerCase()] || 0;
            return at - bt;
        });

        const current = sorted.find((s) => s.current);

        // Source = the session immediately BEFORE current in sorted order
        let source = null;
        if (current) {
            const idx = sorted.findIndex((s) => s.id === current.id);
            if (idx > 0) source = sorted[idx - 1];
        }
        // Fallback: if no current or current is oldest, pick the second-to-last
        if (!source && sorted.length > 1) source = sorted[sorted.length - 2];

        if (source && !sourceSessionId) setSourceSessionId(source.id);
        if (current && !targetSessionId) setTargetSessionId(current.id);
    }, [sessions]);

    const allClasses = Array.isArray(classes) ? classes : [];

    const handleAddSourceClass = (classId) => {
        const sourceClass = allClasses.find((c) => c.id === classId);
        if (!sourceClass) return;
        if (mappings.some((m) => m.sourceClassId === classId)) return;
        setMappings([
            ...mappings,
            {
                sourceClassId: sourceClass.id,
                sourceClassName: sourceClass.name,
                targetClassId: null,
                graduate: false,
            },
        ]);
    };

    const handleRowChange = (updated) => {
        setMappings(mappings.map((m) =>
            m.sourceClassId === updated.sourceClassId ? updated : m
        ));
    };

    const handleRowRemove = (sourceClassId) => {
        setMappings(mappings.filter((m) => m.sourceClassId !== sourceClassId));
    };

    const availableSources = useMemo(
        () => allClasses.filter((c) => !mappings.some((m) => m.sourceClassId === c.id)),
        [allClasses, mappings]
    );

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleProceedToPreview = async () => {
        if (!sourceSessionId) { setAlertType("error"); setMessage("Select the source session"); setOpen(true); return; }
        if (!targetSessionId) { setAlertType("error"); setMessage("Select the target session"); setOpen(true); return; }
        if (sourceSessionId === targetSessionId) { setAlertType("error"); setMessage("Source and target sessions must differ"); setOpen(true); return; }
        if (mappings.length === 0) { setAlertType("error"); setMessage("Add at least one class mapping"); setOpen(true); return; }
        if (mappings.some((m) => !m.graduate && !m.targetClassId)) { setAlertType("error"); setMessage("Each mapping needs a target class or the Graduate flag"); setOpen(true); return; }

        const requestBody = {
            sourceSessionId,
            targetSessionId,
            mappings: mappings.map((m) => ({
                sourceClassId: m.sourceClassId,
                targetClassId: m.graduate ? null : m.targetClassId,
                graduate: !!m.graduate,
            })),
        };

        try {
            await dispatch(previewPromotion(requestBody)).unwrap();
            navigate("/promotion/preview", { state: { requestBody } });
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || "Preview failed");
            setOpen(true);
        }
    };

    const isLoading = sessionFetchingStatus === 'loading' || classFetchingStatus === 'loading';

    // Helper to render a session label with a "(current)" tag
    const sessionLabel = (s) =>
        `${s.session} – ${s.term}${s.current ? " (current)" : ""}`;

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
                                    <Typography variant="h4" noWrap>Promotion Setup</Typography>
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
                                        <p className={style['form-header']}>Setup Promotion</p>

                                        {/* Source session = previous (what students are leaving) */}
                                        <FormControl fullWidth sx={{ mt: 1 }}>
                                            <InputLabel sx={{ fontSize: 16 }}>Source Session (previous)</InputLabel>
                                            <Select
                                                value={sourceSessionId}
                                                onChange={(e) => setSourceSessionId(e.target.value)}
                                                variant="filled"
                                                sx={{ fontSize: 16 }}
                                            >
                                                {(sessions || []).map((s) => (
                                                    <MenuItem key={s.id} value={s.id} sx={{ fontSize: 16 }}>
                                                        {sessionLabel(s)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* Target session = current (where they're going) */}
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel sx={{ fontSize: 16 }}>Target Session (current)</InputLabel>
                                            <Select
                                                value={targetSessionId}
                                                onChange={(e) => setTargetSessionId(e.target.value)}
                                                variant="filled"
                                                sx={{ fontSize: 16 }}
                                            >
                                                {(sessions || [])
                                                    .filter((s) => s.id !== sourceSessionId)
                                                    .map((s) => (
                                                        <MenuItem key={s.id} value={s.id} sx={{ fontSize: 16 }}>
                                                            {sessionLabel(s)}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>

                                        {/* Add class button */}
                                        <FormControl fullWidth sx={{ mt: 3 }}>
                                            <InputLabel sx={{ fontSize: 16 }}>Add a class to map</InputLabel>
                                            <Select
                                                value=""
                                                onChange={(e) => handleAddSourceClass(e.target.value)}
                                                variant="filled"
                                                sx={{ fontSize: 16 }}
                                            >
                                                {availableSources.map((c) => (
                                                    <MenuItem key={c.id} value={c.id} sx={{ fontSize: 16 }}>
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* Mapping table */}
                                        {mappings.length > 0 && (
                                            <div style={{ marginTop: "2rem" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 0.4fr", gap: "1rem", padding: "0 1rem 0.5rem 1rem", fontWeight: 600, color: "#0e387a", fontSize: 15 }}>
                                                    <span>Source Class</span>
                                                    <span>Target Class</span>
                                                    <span>Action</span>
                                                    <span />
                                                </div>
                                                {mappings.map((m) => (
                                                    <PromotionMappingRow
                                                        key={m.sourceClassId}
                                                        row={m}
                                                        allClasses={allClasses.filter((c) => c.id !== m.sourceClassId)}
                                                        onChange={handleRowChange}
                                                        onRemove={() => handleRowRemove(m.sourceClassId)}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleProceedToPreview}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: "2rem" }}
                                        >
                                            Preview Promotion
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

export default PromotionSetup;