// File: src/component/promotion/PromotionPreview.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    clearPromotionResult,
    executePromotion,
    previewPromotion,
} from '../../redux/reducer/promotionSlice';
import style from '../style/form/StudentRegistration.module.css';

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
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
    [theme.breakpoints.up('sm')]: { maxWidth: '900px' },
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

const PromotionPreview = () => {

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
    const location = useLocation();
    const requestBody = location.state?.requestBody;

    const promotionState = useSelector((state) => state.promotion);
    const { preview, executingStatus } = promotionState;

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
        if (!preview && requestBody) {
            dispatch(previewPromotion(requestBody));
        }
    }, [preview, requestBody]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleExecute = async () => {
        if (!requestBody) {
            setAlertType("error");
            setMessage("Nothing to execute. Go back to Setup.");
            setOpen(true);
            return;
        }
        try {
            const result = await dispatch(executePromotion(requestBody)).unwrap();
            dispatch(clearPromotionResult());
            setAlertType("success");
            setMessage(result.message || "Promotion executed");
            setOpen(true);
            setTimeout(() => navigate("/promotion/history"), 1200);
        } catch (error) {
            setAlertType("error");
            setMessage(error?.message || "Execute failed");
            setOpen(true);
        }
    };

    // --- No-preview fallback screen (no ClickAwayListener wrapping multiple children) ---
    if (!preview) {
        return (
            <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <Box component="main" sx={{ flexGrow: 1, marginTop: 8, width: '100%' }}>
                        <SignInContainer>
                            <Card>
                                <p className={style['form-header']}>No preview available</p>
                                <p style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
                                    Go back to Promotion Setup, choose your sessions and mappings, and click Preview again.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/promotion/setup")}
                                    className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                >
                                    Back to Setup
                                </button>
                            </Card>
                        </SignInContainer>
                    </Box>
                </Box>
            </ClickAwayListener>
        );
    }

    return (
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
                            <Typography variant="h4" noWrap>Preview Promotion</Typography>
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
                                <p className={style['form-header']}>Preview</p>

                                {!preview.valid ? (
                                    <p style={{ color: 'crimson', fontSize: 16, textAlign: 'center', padding: 12 }}>
                                        {preview.validationMessage || "Invalid mapping"}
                                    </p>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                            <span style={{ fontWeight: 600 }}>Source Session:</span>
                                            <span>{preview.sourceSessionLabel}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                            <span style={{ fontWeight: 600 }}>Target Session:</span>
                                            <span>{preview.targetSessionLabel}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                            <span style={{ fontWeight: 600 }}>Total Students Affected:</span>
                                            <span>{preview.totalStudents}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                            <span style={{ fontWeight: 600 }}>Promoted:</span>
                                            <span>{preview.totalPromoted}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                            <span style={{ fontWeight: 600 }}>Graduated:</span>
                                            <span>{preview.totalGraduated}</span>
                                        </div>

                                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                                            <Table sx={{ minWidth: 600 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontSize: 16, fontWeight: 700, color: '#0e387a' }}>Source Class</TableCell>
                                                        <TableCell sx={{ fontSize: 16, fontWeight: 700, color: '#0e387a' }}>Target Class</TableCell>
                                                        <TableCell sx={{ fontSize: 16, fontWeight: 700, color: '#0e387a' }}>Students</TableCell>
                                                        <TableCell sx={{ fontSize: 16, fontWeight: 700, color: '#0e387a' }}>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(preview.rows || []).map((row) => (
                                                        <TableRow key={row.sourceClassId}>
                                                            <TableCell sx={{ fontSize: 16 }}>{row.sourceClassName}</TableCell>
                                                            <TableCell sx={{ fontSize: 16 }}>{row.targetClassName}</TableCell>
                                                            <TableCell sx={{ fontSize: 16 }}>{row.studentCount}</TableCell>
                                                            <TableCell sx={{ fontSize: 16 }}>
                                                                {row.graduate ? "GRADUATE" : "Promote"}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <button
                                            type="button"
                                            onClick={handleExecute}
                                            disabled={executingStatus === 'loading'}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: '2rem' }}
                                        >
                                            {executingStatus === 'loading' ? 'Executing...' : 'Execute Promotion'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => navigate("/promotion/setup")}
                                            className={[style['btn'], style['btn--block'], style['btn--ghost']].join(' ')}
                                            style={{ marginTop: '1rem', background: '#eee', color: '#0e387a' }}
                                        >
                                            Back to Setup
                                        </button>
                                    </>
                                )}
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
    );
};

export default PromotionPreview;