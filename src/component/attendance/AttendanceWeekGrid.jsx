// File: src/component/attendance/AttendanceWeekGrid.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    clearWeek,
    fetchAttendanceWeek,
    markAttendanceWeek,
} from '../../redux/reducer/attendanceSlice';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
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
    [theme.breakpoints.up('sm')]: { maxWidth: '1100px' },
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

const DAY_LABEL = {
    MON: 'M', TUE: 'T', WED: 'W', THU: 'T', FRI: 'F', SAT: 'S', SUN: 'S',
};
const DAY_TO_JAVA_INDEX = {
    MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7,
};

const buildWeekColumns = (weekStart, teachingDays) => {
    const start = new Date(weekStart);
    const jsDayOfWeek = (d) => {
        const dow = d.getDay();
        return dow === 0 ? 7 : dow;
    };
    const startIndex = jsDayOfWeek(start);

    const columns = [];
    for (const day of teachingDays) {
        const target = DAY_TO_JAVA_INDEX[day];
        if (target === undefined) continue;
        const diff = target - startIndex;
        const date = new Date(start);
        date.setDate(start.getDate() + diff);
        columns.push({
            day,
            label: DAY_LABEL[day] || day,
            date: date.toISOString().split('T')[0],
        });
    }
    columns.sort((a, b) => a.date.localeCompare(b.date));
    return columns;
};

const AttendanceWeekGrid = () => {

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

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;

    const attendanceState = useSelector((state) => state.attendance);
    const { week, fetchingStatus, markingStatus } = attendanceState;

    const [classId, setClassId] = useState("");
    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date();
        const day = d.getDay();
        const diff = (day === 0 ? -6 : 1 - day);
        d.setDate(d.getDate() + diff);
        return d.toISOString().split('T')[0];
    });
    const [marks, setMarks] = useState({});

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
        dispatch(getAllClassnameAndId());
    }, []);

    const allClasses = Array.isArray(classes) ? classes : [];

    // Fetch week when class or week changes
    useEffect(() => {
        if (!classId) {
            dispatch(clearWeek());
            setMarks({});
            return;
        }
        dispatch(fetchAttendanceWeek({ classId, weekStart }));
    }, [classId, weekStart, dispatch]);

    // Sync local marks with fetched week
    useEffect(() => {
        if (!week) {
            setMarks({});
            return;
        }
        setMarks(week.students.reduce((acc, row) => {
            acc[row.studentId] = { ...row.days };
            return acc;
        }, {}));
    }, [week]);

    const columns = useMemo(() => {
        if (!week) return [];
        return buildWeekColumns(week.startDate, week.teachingDays);
    }, [week]);

    // Set a cell to a value. Clicking the same value clears it.
    const setCell = (studentId, date, value) => {
        setMarks((prev) => {
            const current = prev[studentId]?.[date] ?? null;
            const next = current === value ? null : value;
            return { ...prev, [studentId]: { ...prev[studentId], [date]: next } };
        });
    };

    const markAllPresent = () => {
        if (!week) return;
        const next = {};
        week.students.forEach((row) => {
            next[row.studentId] = {};
            columns.forEach((col) => {
                next[row.studentId][col.date] = 'PRESENT';
            });
        });
        setMarks(next);
    };

    const handleSave = async () => {
        if (!week) return;
        const records = [];
        Object.entries(marks).forEach(([studentIdStr, days]) => {
            Object.entries(days).forEach(([date, status]) => {
                records.push({
                    studentId: Number(studentIdStr),
                    date,
                    status,
                });
            });
        });

        try {
            const result = await dispatch(markAttendanceWeek({
                classId: Number(classId),
                weekStartDate: weekStart,
                records,
            })).unwrap();
            setAlertType('success');
            setMessage(result.message || 'Attendance saved');
            setOpen(true);
            // Refetch to confirm
            dispatch(fetchAttendanceWeek({ classId, weekStart }));
        } catch (error) {
            setAlertType('error');
            setMessage(error?.message || 'Failed to save');
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const shiftWeek = (direction) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + direction * 7);
        setWeekStart(d.toISOString().split('T')[0]);
    };

    return (
        <>
            {fetchingStatus === 'loading' && !week ? (<Loading />) : (
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
                                    <Typography variant="h4" noWrap>Class Attendance</Typography>
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
                                        <p className={style['form-header']}>Class Attendance</p>

                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                            <div style={{ flex: 1, minWidth: 220 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Class</label>
                                                <select
                                                    value={classId}
                                                    onChange={(e) => setClassId(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select class</option>
                                                    {allClasses.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => shiftWeek(-1)}
                                                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                                                >
                                                    &lt; Previous
                                                </button>
                                                <div style={{ fontSize: 15, fontWeight: 600, color: '#0e387a', minWidth: 180, textAlign: 'center' }}>
                                                    Week of {weekStart}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => shiftWeek(1)}
                                                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                                                >
                                                    Next &gt;
                                                </button>
                                            </div>
                                        </div>

                                        {!week ? (
                                            <div style={{ padding: 30, textAlign: 'center', color: '#6b7a99' }}>
                                                Select a class to load its attendance grid.
                                            </div>
                                        ) : week.students.length === 0 ? (
                                            <div style={{ padding: 30, textAlign: 'center', color: '#6b7a99' }}>
                                                No students enrolled in this class for the current session.
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                                    <button
                                                        type="button"
                                                        onClick={markAllPresent}
                                                        style={{
                                                            background: '#2f7a3a',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            padding: '8px 14px',
                                                            cursor: 'pointer',
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Mark all present
                                                    </button>
                                                </div>

                                                <div style={{
                                                    overflowX: 'auto',
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: 8,
                                                    marginTop: 12,
                                                }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                                        <thead>
                                                            <tr style={{ background: '#0e387a', color: '#fff' }}>
                                                                <th style={{ padding: '10px 8px', textAlign: 'left', width: 50 }}>No.</th>
                                                                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Student Name</th>
                                                                {columns.map((col) => (
                                                                    <th key={col.date} style={{ padding: '10px 4px', width: 38, textAlign: 'center' }}>
                                                                        {col.label}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {week.students.map((row, index) => (
                                                                <tr key={row.studentId} style={{ borderBottom: '1px solid #eee' }}>
                                                                    <td style={{ padding: '6px 8px' }}>{index + 1}</td>
                                                                    <td style={{ padding: '6px 8px', fontWeight: 500 }}>{row.fullName}</td>
                                                                    {columns.map((col) => {
                                                                        const status = marks[row.studentId]?.[col.date] ?? null;
                                                                        const bg = status === 'PRESENT' ? '#f4fbf5'
                                                                                 : status === 'ABSENT'  ? '#fdf5f5'
                                                                                 : '#fff';
                                                                        return (
                                                                            <td key={col.date} style={{ padding: 2, textAlign: 'center', background: bg }}>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setCell(row.studentId, col.date, 'PRESENT')}
                                                                                        title="Mark Present"
                                                                                        style={{
                                                                                            width: 30, height: 22,
                                                                                            border: status === 'PRESENT' ? '2px solid #2f7a3a' : '1px solid #ccc',
                                                                                            borderRadius: 4,
                                                                                            background: status === 'PRESENT' ? '#c8e6c9' : '#fff',
                                                                                            color: '#2f7a3a',
                                                                                            fontSize: 11,
                                                                                            fontWeight: 700,
                                                                                            cursor: 'pointer',
                                                                                            padding: 0,
                                                                                            lineHeight: 1,
                                                                                        }}
                                                                                    >
                                                                                        P
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setCell(row.studentId, col.date, 'ABSENT')}
                                                                                        title="Mark Absent"
                                                                                        style={{
                                                                                            width: 30, height: 22,
                                                                                            border: status === 'ABSENT' ? '2px solid #c43e3e' : '1px solid #ccc',
                                                                                            borderRadius: 4,
                                                                                            background: status === 'ABSENT' ? '#ffcdd2' : '#fff',
                                                                                            color: '#c43e3e',
                                                                                            fontSize: 11,
                                                                                            fontWeight: 700,
                                                                                            cursor: 'pointer',
                                                                                            padding: 0,
                                                                                            lineHeight: 1,
                                                                                        }}
                                                                                    >
                                                                                        A
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div style={{ fontSize: 13, color: '#6b7a99', marginTop: 8 }}>
                                                    Click <strong>P</strong> to mark present, <strong>A</strong> to mark absent. Click the same button again to clear.
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleSave}
                                                    disabled={markingStatus === 'loading'}
                                                    className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                                    style={{ marginTop: 12 }}
                                                >
                                                    {markingStatus === 'loading' ? 'Saving...' : 'Save Week'}
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

export default AttendanceWeekGrid;