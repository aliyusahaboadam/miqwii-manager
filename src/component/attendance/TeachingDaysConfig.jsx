// File: src/component/attendance/TeachingDaysConfig.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    [theme.breakpoints.up('sm')]: { maxWidth: '600px' },
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

const ALL_DAYS = [
    { code: 'MON', label: 'Monday' },
    { code: 'TUE', label: 'Tuesday' },
    { code: 'WED', label: 'Wednesday' },
    { code: 'THU', label: 'Thursday' },
    { code: 'FRI', label: 'Friday' },
    { code: 'SAT', label: 'Saturday' },
    { code: 'SUN', label: 'Sunday' },
];

const TeachingDaysConfig = () => {

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = React.useState(null);

    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;
    const handleClickAway = () => setAnchorProfile(null);

    const navigate = useNavigate();

    const [selectedDays, setSelectedDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        const token = localStorage.getItem('token');
        api.get(
            `${import.meta.env.VITE_API_URL}/v1/api/school/get-teaching-days`,
            { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
        ).then((response) => {
            setSelectedDays(response.data?.teachingDays || []);
        }).catch((error) => {
            console.error('Failed to load teaching days', error);
            setSelectedDays(['MON', 'TUE', 'WED', 'THU', 'FRI']);
        }).finally(() => setLoading(false));
    }, []);

    const toggleDay = (code) => {
        setSelectedDays((prev) =>
            prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
        );
    };

    const handleSave = async () => {
        if (selectedDays.length === 0) {
            setAlertType('error');
            setMessage('Select at least one teaching day');
            setOpen(true);
            return;
        }
        setSaving(true);
        try {
            // Preserve chronological order
            const ordered = ALL_DAYS
                .map((d) => d.code)
                .filter((c) => selectedDays.includes(c));

            const token = localStorage.getItem('token');
            const response = await api.put(
                `${import.meta.env.VITE_API_URL}/v1/api/school/update-teaching-days`,
                { teachingDays: ordered },
                { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
            );
            setAlertType('success');
            setMessage(response.data?.message || 'Teaching days updated');
            setOpen(true);
        } catch (error) {
            setAlertType('error');
            setMessage(error?.message || 'Failed to save');
            setOpen(true);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <>
            {loading ? (<Loading />) : (
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
                                    <Typography variant="h4" noWrap>Teaching Days</Typography>
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
                                        <p className={style['form-header']}>Teaching Days</p>

                                        <div style={{ fontSize: 14, color: '#6b7a99' }}>
                                            Choose the days your school runs. The attendance grid
                                            will show a column for each selected day.
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                                            {ALL_DAYS.map((day) => (
                                                <label
                                                    key={day.code}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '10px 14px',
                                                        background: selectedDays.includes(day.code) ? '#f0f6ff' : '#fff',
                                                        border: '1px solid #e5e5e5',
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDays.includes(day.code)}
                                                        onChange={() => toggleDay(day.code)}
                                                        style={{ marginRight: 12, width: 20, height: 20 }}
                                                    />
                                                    {day.label}
                                                </label>
                                            ))}
                                        </div>

                                        <div style={{ fontSize: 13, color: '#6b7a99', marginTop: 12 }}>
                                            Selected: <strong>{selectedDays.length}</strong> day{selectedDays.length === 1 ? '' : 's'}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: 12 }}
                                        >
                                            {saving ? 'Saving...' : 'Save Teaching Days'}
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

export default TeachingDaysConfig;