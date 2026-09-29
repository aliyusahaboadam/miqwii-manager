// File: src/component/promotion/PromotionSetup.jsx
import { Alert, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import {
    clearPromotionPreview,
    previewPromotion,
} from '../../redux/reducer/promotionSlice';
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
    [theme.breakpoints.up('sm')]: { maxWidth: '1000px' },
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
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
}));

// -----------------------------------------------------------------------
// Infer next class name. Same logic as before, used for defaults.
// -----------------------------------------------------------------------
const MAX_LEVEL = {
    "PRE-NUR": 2,
    "NUR": 3,
    "PRI": 6,
    "JSS": 3,
    "JIS": 3,
    "SSS": 3,
    "SIS": 3,
};

const nextClassName = (current) => {
    if (!current) return null;
    const m = current.match(/^([A-Z]+(?:-[A-Z]+)?)\s*(\d+)\s*([A-Z]?)$/);
    if (!m) return null;
    const prefix = m[1].toUpperCase();
    const level = parseInt(m[2], 10);
    const suffix = m[3] || '';
    const max = MAX_LEVEL[prefix];
    if (max === undefined) return null;
    const nextLevel = level + 1;
    if (nextLevel > max) return null;
    return `${prefix}${nextLevel}${suffix}`;
};

const classOrder = (name) => {
    if (!name) return [99, 99, ''];
    const m = name.match(/^([A-Z]+(?:-[A-Z]+)?)\s*(\d+)\s*([A-Z]?)$/);
    if (!m) return [99, 99, name];
    const prefixOrder = {
        "PRE-NUR": 1,
        "NUR": 2,
        "PRI": 3,
        "JSS": 4,
        "JIS": 4,
        "SSS": 5,
        "SIS": 5,
    };
    const p = prefixOrder[m[1].toUpperCase()] ?? 99;
    const l = parseInt(m[2], 10);
    const s = m[3] || '';
    return [p, l, s];
};

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

    // -----------------------------------------------------------------
    // TWO count maps, each scoped to a different session:
    //   sourceActiveCounts[classId] = active students in the SOURCE session
    //   targetActiveCounts[classId] = active students in the TARGET session
    //
    // The source dropdown labels read from the source map.
    // The target dropdown labels read from the target map.
    // The row validation reads the correct map per side.
    // This is what prevents the target dropdown from showing the
    // source session's numbers (and vice versa).
    // -----------------------------------------------------------------
    const [sourceActiveCounts, setSourceActiveCounts] = useState({});
    const [targetActiveCounts, setTargetActiveCounts] = useState({});
    const [sourceCountsLoading, setSourceCountsLoading] = useState(false);
    const [targetCountsLoading, setTargetCountsLoading] = useState(false);

    // Ordered classes with counts
    const orderedClasses = useMemo(() => {
        if (!Array.isArray(classes)) return [];
        return [...classes].sort((a, b) => {
            const ao = classOrder(a.name);
            const bo = classOrder(b.name);
            if (ao[0] !== bo[0]) return ao[0] - bo[0];
            if (ao[1] !== bo[1]) return ao[1] - bo[1];
            return String(ao[2]).localeCompare(String(bo[2]));
        });
    }, [classes]);

    // Mapping rows: { id, sourceClassId, targetClassId | 'GRADUATE' }
    const [mappings, setMappings] = useState([]);

    const [sourceSessionId, setSourceSessionId] = useState("");
    const [targetSessionId, setTargetSessionId] = useState("");

    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");

    const authenticated = false;
    const logout = () => {
        localStorage.removeItem('token');
        navigate("/school/login");
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
    };

    // -------------------- Load initial data --------------------
    useEffect(() => {
        dispatch(getAllSchoolSession());
        dispatch(getAllClassnameAndId());
        dispatch(clearPromotionPreview());
    }, []);

    // -------------------- Fetch counts for one session --------------------
    const fetchCountsForSession = useCallback(async (sessionId) => {
        if (!sessionId) return null;
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(
                `${import.meta.env.VITE_API_URL}/v1/api/class/active-counts`,
                {
                    params: { sessionId },
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }
            );
            const map = {};
            (response.data || []).forEach((row) => {
                map[row.classId] = row.activeStudents;
            });
            return map;
        } catch (error) {
            console.error(`Failed to fetch active counts for session ${sessionId}`, error);
            return {};
        }
    }, []);

    // -------------------- Re-fetch SOURCE counts when source session changes --------------------
    useEffect(() => {
        let cancelled = false;
        if (!sourceSessionId) {
            setSourceActiveCounts({});
            return;
        }
        setSourceCountsLoading(true);
        fetchCountsForSession(sourceSessionId).then((map) => {
            if (cancelled) return;
            setSourceActiveCounts(map || {});
            setSourceCountsLoading(false);
        });
        return () => { cancelled = true; };
    }, [sourceSessionId, fetchCountsForSession]);

    // -------------------- Re-fetch TARGET counts when target session changes --------------------
    useEffect(() => {
        let cancelled = false;
        if (!targetSessionId) {
            setTargetActiveCounts({});
            return;
        }
        setTargetCountsLoading(true);
        fetchCountsForSession(targetSessionId).then((map) => {
            if (cancelled) return;
            setTargetActiveCounts(map || {});
            setTargetCountsLoading(false);
        });
        return () => { cancelled = true; };
    }, [targetSessionId, fetchCountsForSession]);

    // -------------------- Session defaults --------------------
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
        if (!current) return;

        const idx = sorted.findIndex((s) => s.id === current.id);
        const source = idx > 0 ? sorted[idx - 1] : null;

        if (source && !sourceSessionId) setSourceSessionId(source.id);
        if (current && !targetSessionId) setTargetSessionId(current.id);
    }, [sessions]);

    // -------------------- Mapping row operations --------------------
    const addMapping = () => {
        setMappings((prev) => [
            ...prev,
            { id: `row-${Date.now()}-${Math.random()}`, sourceClassId: "", targetClassId: "" },
        ]);
    };

    const updateMapping = (rowId, patch) => {
        setMappings((prev) =>
            prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row))
        );
    };

    const removeMapping = (rowId) => {
        setMappings((prev) => prev.filter((row) => row.id !== rowId));
    };

    // -------------------- Changing source session --------------------
    // Source session change invalidates every mapping row (source classes
    // belong to the old session). Clear them so nothing stale gets promoted.
    const handleSourceSessionChange = (newSourceSessionId) => {
        setSourceSessionId(newSourceSessionId);
        setMappings([]);
    };

    // -------------------- Changing target session --------------------
    // Target session change does NOT clear mappings — the source classes
    // are still valid. The rows are re-evaluated automatically because
    // targetActiveCounts will refresh and evaluateRow depends on it.
    const handleTargetSessionChange = (newTargetSessionId) => {
        setTargetSessionId(newTargetSessionId);
    };

    // -------------------- Auto-fill target when source class changes --------------------
    const handleSourceChange = (rowId, sourceClassId) => {
        const sourceClass = orderedClasses.find((c) => c.id === sourceClassId);
        const inferredName = sourceClass ? nextClassName(sourceClass.name) : null;
        const inferredTarget = inferredName
            ? orderedClasses.find((c) => c.name === inferredName)
            : null;

        updateMapping(rowId, {
            sourceClassId,
            targetClassId: inferredTarget ? inferredTarget.id : 'GRADUATE',
        });
    };

    // -------------------- Validation per row --------------------
    // Source count comes from the SOURCE session's map.
    // Target count comes from the TARGET session's map.
    // Nothing here reads a count that belongs to the other session.
    const evaluateRow = (row) => {
        if (!row.sourceClassId) return { status: 'empty', message: 'Pick a source class' };
        if (!row.targetClassId) return { status: 'empty', message: 'Pick a target class' };

        const sourceClass = orderedClasses.find((c) => c.id === row.sourceClassId);
        const sourceCount = sourceActiveCounts[row.sourceClassId] ?? 0;

        if (sourceCount === 0) {
            return { status: 'disabled', message: 'No students in this class for the source session' };
        }

        if (row.targetClassId === 'GRADUATE') {
            return { status: 'ready', message: '' };
        }

        if (row.targetClassId === row.sourceClassId) {
            return { status: 'error', message: 'Source and target cannot be the same' };
        }

        const targetClass = orderedClasses.find((c) => c.id === row.targetClassId);
        const targetCount = targetActiveCounts[row.targetClassId] ?? 0;

        if (targetCount > 0) {
            return {
                status: 'blocked',
                message: `${targetClass.name} still has ${targetCount} student${targetCount === 1 ? '' : 's'} in the target session. Promote ${targetClass.name} first — otherwise its students and the incoming ones will be mixed together.`,
            };
        }

        return { status: 'ready', message: '' };
    };

    // -------------------- Merge warning across rows --------------------
    const mergeWarnings = useMemo(() => {
        const byTarget = {};
        mappings.forEach((row) => {
            const evalResult = evaluateRow(row);
            if (evalResult.status !== 'ready') return;
            if (row.targetClassId === 'GRADUATE') return;
            const key = row.targetClassId;
            if (!byTarget[key]) byTarget[key] = [];
            const sourceClass = orderedClasses.find((c) => c.id === row.sourceClassId);
            if (sourceClass) byTarget[key].push(sourceClass.name);
        });
        return Object.entries(byTarget)
            .filter(([, list]) => list.length > 1)
            .map(([targetId, sources]) => {
                const target = orderedClasses.find((c) => String(c.id) === String(targetId));
                return { targetName: target?.name || targetId, sources };
            });
    }, [mappings, sourceActiveCounts, targetActiveCounts, orderedClasses]);

    // -------------------- Submit --------------------
    const handleProceedToPreview = async () => {
        if (!sourceSessionId) { setAlertType("error"); setMessage("Select the source session"); setOpen(true); return; }
        if (!targetSessionId) { setAlertType("error"); setMessage("Select the target session"); setOpen(true); return; }
        if (sourceSessionId === targetSessionId) { setAlertType("error"); setMessage("Source and target sessions must differ"); setOpen(true); return; }
        if (mappings.length === 0) { setAlertType("error"); setMessage("Add at least one mapping"); setOpen(true); return; }

        const invalid = mappings.filter((row) => {
            const s = evaluateRow(row).status;
            return s !== 'ready';
        });
        if (invalid.length > 0) {
            setAlertType("error");
            setMessage("Some rows are not ready. Fix or remove them before continuing.");
            setOpen(true);
            return;
        }

        const requestBody = {
            sourceSessionId,
            targetSessionId,
            mappings: mappings.map((row) => ({
                sourceClassId: row.sourceClassId,
                targetClassId: row.targetClassId === 'GRADUATE' ? null : row.targetClassId,
                graduate: row.targetClassId === 'GRADUATE',
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

    const isLoading =
        sessionFetchingStatus === 'loading' ||
        classFetchingStatus === 'loading' ||
        sourceCountsLoading ||
        targetCountsLoading;

    const sessionLabel = (s) =>
        s ? `${s.session} – ${s.term}${s.current ? " (current)" : ""}` : "";

    // Source labels read from sourceActiveCounts.
    const sourceClassLabel = (c) => {
        const count = sourceActiveCounts[c.id] ?? 0;
        return `${c.name} (${count} student${count === 1 ? '' : 's'})`;
    };

    // Target labels read from targetActiveCounts.
    const targetClassLabel = (c) => {
        const count = targetActiveCounts[c.id] ?? 0;
        return `${c.name} (${count} student${count === 1 ? '' : 's'})`;
    };

    // -------------------- Render --------------------
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
                                        <p className={style['form-header']}>Promote Classes</p>

                                        {/* Sessions */}
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: 240 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Source Session (previous)</label>
                                                <select
                                                    value={sourceSessionId}
                                                    onChange={(e) => handleSourceSessionChange(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select source session</option>
                                                    {(sessions || []).map((s) => (
                                                        <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 240 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600, color: '#0e387a' }}>Target Session (current)</label>
                                                <select
                                                    value={targetSessionId}
                                                    onChange={(e) => handleTargetSessionChange(e.target.value)}
                                                    style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 8, marginTop: 4 }}
                                                >
                                                    <option value="">Select target session</option>
                                                    {(sessions || [])
                                                        .filter((s) => s.id !== sourceSessionId)
                                                        .map((s) => (
                                                            <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div style={{ fontSize: 13, color: '#6b7a99', marginTop: 12 }}>
                                            Add a row for each class you want to promote. Source dropdown shows
                                            counts in the <strong>source session</strong>. Target dropdown shows
                                            counts in the <strong>target session</strong>. A target class that
                                            still has students will block the promotion until it's empty.
                                        </div>

                                        {/* Merge warnings */}
                                        {mergeWarnings.map((w) => (
                                            <div
                                                key={w.targetName}
                                                style={{
                                                    marginTop: 8,
                                                    padding: '8px 12px',
                                                    background: '#fff8e1',
                                                    border: '1px solid #f2d68c',
                                                    borderRadius: 8,
                                                    fontSize: 14,
                                                    color: '#6b5518',
                                                }}
                                            >
                                                <strong>Merge:</strong> {w.sources.join(' and ')} → {w.targetName}.
                                                Students from both classes will end up in one class.
                                            </div>
                                        ))}

                                        {/* Mapping rows */}
                                        <div style={{ marginTop: 16 }}>
                                            {mappings.map((row) => {
                                                const evalResult = evaluateRow(row);
                                                const sourceClass = orderedClasses.find((c) => c.id === row.sourceClassId);
                                                const targetClass = row.targetClassId === 'GRADUATE'
                                                    ? null
                                                    : orderedClasses.find((c) => c.id === row.targetClassId);

                                                const rowBg =
                                                    evalResult.status === 'ready' ? '#f4f9ff'
                                                        : evalResult.status === 'blocked' || evalResult.status === 'error' ? '#fdecec'
                                                            : '#f9f9f9';

                                                const borderColor =
                                                    evalResult.status === 'ready' ? '#c7d8f5'
                                                        : evalResult.status === 'blocked' || evalResult.status === 'error' ? '#f5c7c7'
                                                            : '#e5e5e5';

                                                return (
                                                    <div
                                                        key={row.id}
                                                        style={{
                                                            background: rowBg,
                                                            border: `1px solid ${borderColor}`,
                                                            borderRadius: 10,
                                                            padding: '10px 12px',
                                                            marginBottom: 10,
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                                            {/* Source dropdown — reads source counts */}
                                                            <select
                                                                value={row.sourceClassId || ''}
                                                                onChange={(e) => handleSourceChange(row.id, e.target.value ? Number(e.target.value) : '')}
                                                                style={{ flex: 1, minWidth: 220, fontSize: 15, padding: '8px 10px', borderRadius: 8 }}
                                                            >
                                                                <option value="">Select source class</option>
                                                                {orderedClasses.map((c) => (
                                                                    <option key={c.id} value={c.id}>{sourceClassLabel(c)}</option>
                                                                ))}
                                                            </select>

                                                            <span style={{ fontSize: 20, color: '#888' }}>→</span>

                                                            {/* Target dropdown — reads target counts */}
                                                            <select
                                                                value={row.targetClassId || ''}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    updateMapping(row.id, {
                                                                        targetClassId: val === 'GRADUATE' ? 'GRADUATE' : (val ? Number(val) : '')
                                                                    });
                                                                }}
                                                                style={{ flex: 1, minWidth: 220, fontSize: 15, padding: '8px 10px', borderRadius: 8 }}
                                                            >
                                                                <option value="">Select target class</option>
                                                                <option value="GRADUATE">GRADUATE (no target class)</option>
                                                                {orderedClasses
                                                                    .filter((c) => c.id !== row.sourceClassId)
                                                                    .map((c) => (
                                                                        <option key={c.id} value={c.id}>{targetClassLabel(c)}</option>
                                                                    ))}
                                                            </select>

                                                            {/* Remove */}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMapping(row.id)}
                                                                style={{
                                                                    background: '#c43e3e',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: 8,
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer',
                                                                    fontSize: 14,
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                        {/* Status line */}
                                                        {evalResult.message && (
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                    fontSize: 13,
                                                                    color: evalResult.status === 'ready' ? '#2f7a3a'
                                                                        : evalResult.status === 'blocked' || evalResult.status === 'error' ? '#c43e3e'
                                                                            : '#6b7a99',
                                                                }}
                                                            >
                                                                {evalResult.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            <button
                                                type="button"
                                                onClick={addMapping}
                                                style={{
                                                    marginTop: 6,
                                                    background: '#0e387a',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 8,
                                                    padding: '10px 16px',
                                                    cursor: 'pointer',
                                                    fontSize: 15,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                + Add Mapping
                                            </button>
                                        </div>

                                        {/* Summary + Submit */}
                                        <div style={{ marginTop: 16, fontSize: 15 }}>
                                            <strong>{mappings.length}</strong> mapping{mappings.length === 1 ? '' : 's'}.
                                            Total students to move:{' '}
                                            <strong>
                                                {mappings.reduce(
                                                    (sum, row) => sum + (sourceActiveCounts[row.sourceClassId] ?? 0),
                                                    0
                                                )}
                                            </strong>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleProceedToPreview}
                                            className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                                            style={{ marginTop: '1rem' }}
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

    function handleClose(event, reason) {
        if (reason === "clickaway") return;
        setOpen(false);
    }
};

export default PromotionSetup;