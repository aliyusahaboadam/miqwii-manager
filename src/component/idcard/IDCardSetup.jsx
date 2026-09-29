// File: src/component/idcard/IDCardSetup.jsx
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Alert, IconButton, Snackbar } from "@mui/material";
import { pdf } from '@react-pdf/renderer';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import { getSchoolById, getSchoolWithBasicDetails } from '../../redux/reducer/schoolSlice';
import { getStudentByClass } from '../../redux/reducer/studentSlice';
import Loading from '../Chunks/loading';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';
import IDCardPdf from './IDCardPdf';

import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const SAMPLE_STUDENT = {
    id: 0,
    fullname: 'John Doe',
    firstname: 'John',
    surname: 'Doe',
    lastname: '',
    regNo: 'STU/2024/0001',
    gender: 'MALE',
    entryDate: '2024-09-01',
};

const DEFAULT_COLOR = '#0e387a';

// -----------------------------------------------------------------------
// Logo preload with fallback URLs
// -----------------------------------------------------------------------
const logoCache = {};
const preloadImage = async (url) => {
    if (!url) return null;
    if (logoCache[url]) return logoCache[url];
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn('Logo fetch not ok:', url, response.status);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const getMimeType = (b) => {
            if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
            if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
            if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
            if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[4] === 0x57) return 'image/webp';
            const text = new TextDecoder().decode(b.slice(0, 100));
            if (text.includes('<svg') || text.includes('<?xml')) return 'image/svg+xml';
            return 'image/png';
        };

        const mime = getMimeType(bytes);
        let binary = '';
        bytes.forEach(x => binary += String.fromCharCode(x));
        const base64 = `data:${mime};base64,${btoa(binary)}`;

        if (mime === 'image/svg+xml') {
            const png = await new Promise((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || 200;
                    canvas.height = img.naturalHeight || 200;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = reject;
                img.src = base64;
            });
            logoCache[url] = png;
            return png;
        }

        logoCache[url] = base64;
        return base64;
    } catch (e) {
        console.warn('Logo preload failed:', url, e);
        return null;
    }
};

const resolveLogoUrl = async (rawLogo) => {
    if (!rawLogo) {
        console.log('Logo: no value provided by the backend');
        return null;
    }
    const candidates = [];
    if (rawLogo.startsWith('http')) {
        candidates.push(rawLogo);
    } else {
        candidates.push(`https://d39kcxvd290stw.cloudfront.net/${rawLogo}`);
        candidates.push(rawLogo);
    }
    for (const url of candidates) {
        console.log('Trying logo URL:', url);
        const data = await preloadImage(url);
        if (data) {
            console.log('Logo loaded from:', url);
            return data;
        }
    }
    console.warn('All logo attempts failed for:', rawLogo);
    return null;
};

const IDCardSetup = () => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = useState(null);

    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;
    const handleClickAway = () => setAnchorProfile(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;

    const schoolState = useSelector((state) => state.schools);
    const { school, fetchingStatus: schoolFetchingStatus } = schoolState;

    const studentState = useSelector((state) => state.students);
    const { studentsInClass, fetchingStatus: studentFetchingStatus } = studentState;

    const sessionsState = useSelector((state) => state.sessions);
    const { sessionDetails } = sessionsState;

    const [selectedClassId, setSelectedClassId] = useState('');
    const [cardColor, setCardColor] = useState(DEFAULT_COLOR);
    const [logoUrl, setLogoUrl] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [previewing, setPreviewing] = useState(false);

    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [message, setMessage] = useState('');

    const authenticated = false;
    const logout = () => {
        localStorage.removeItem('token');
        navigate("/school/login");
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
    };

    useEffect(() => {
        dispatch(getAllClassnameAndId());
        dispatch(getSchoolWithBasicDetails());
    }, []);

    useEffect(() => {
        if (school?.id) {
            console.log('Fetching full school DTO for id:', school.id);
            dispatch(getSchoolById(school.id));
        }
    }, [school?.id]);

    useEffect(() => {
        console.log('School payload in slice:', school);
        if (school?.logo) {
            resolveLogoUrl(school.logo).then(setLogoUrl);
        } else {
            setLogoUrl(null);
        }
    }, [school?.logo]);

    const selectedClass = useMemo(
        () => (classes || []).find((c) => String(c.id) === String(selectedClassId)),
        [classes, selectedClassId]
    );

    const sessionLabel = sessionDetails
        ? `${sessionDetails.session || ''} ${sessionDetails.term ? '– ' + sessionDetails.term : ''}`.trim()
        : '';

    useEffect(() => {
        if (selectedClass?.name) {
            dispatch(getStudentByClass(selectedClass.name));
        }
    }, [selectedClass]);

    const students = Array.isArray(studentsInClass) ? studentsInClass : [];

    const buildPdfBlob = async () => {
        const studentsForPdf = students.length > 0 ? students : [SAMPLE_STUDENT];
        const blob = await pdf(
            <IDCardPdf
                students={studentsForPdf}
                school={school || { name: 'School Name', address: '-', motto: '-', contact: '-' }}
                className={selectedClass?.name || 'Sample Class'}
                sessionLabel={sessionLabel}
                color={cardColor}
                logoUrl={logoUrl}
            />
        ).toBlob();
        return blob;
    };

    const handleDownload = async () => {
        if (!selectedClassId) {
            setAlertType('error'); setMessage('Pick a class first'); setOpen(true);
            return;
        }
        if (students.length === 0) {
            setAlertType('error'); setMessage('No students found in this class'); setOpen(true);
            return;
        }
        try {
            setGenerating(true);
            const blob = await buildPdfBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `idcards-${selectedClass?.name || 'class'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            setAlertType('error');
            setMessage(e.message || 'Failed to generate ID cards');
            setOpen(true);
        } finally {
            setGenerating(false);
        }
    };

    const handlePreview = async () => {
        try {
            setPreviewing(true);
            const blob = await buildPdfBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (e) {
            console.error(e);
            setAlertType('error');
            setMessage(e.message || 'Failed to preview ID cards');
            setOpen(true);
        } finally {
            setPreviewing(false);
        }
    };

    const isBusy = generating || previewing;
    const isLoading = schoolFetchingStatus === 'loading' || studentFetchingStatus === 'loading';

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

                            <Box component="main" sx={{ flexGrow: 1, marginTop: 8, fontSize: 23, overflowX: 'auto', width: '100%', color: '#9a99ac' }}>
                                <div className={dashboard['secondary--container']}>

                                    <div style={{
                                        background: '#f4f7ff',
                                        border: '1px solid #d6e0f5',
                                        borderRadius: 10,
                                        padding: '14px 16px',
                                        marginBottom: 16,
                                        color: '#0e387a',
                                        fontSize: 15,
                                        lineHeight: 1.5,
                                    }}>
                                        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>
                                            Generate student ID cards
                                        </div>
                                        <div>
                                            Pick a class, choose the card color, and download. Ten fronts
                                            per A4 sheet, then ten backs on the next set of sheets.
                                        </div>

                                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 14 }}>
                                            <div style={{ minWidth: 260, flex: 1 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600 }}>Class</label>
                                                <select
                                                    value={selectedClassId}
                                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, marginTop: 4, fontSize: 16 }}
                                                >
                                                    <option value="">Select a class</option>
                                                    {(classes || []).map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div style={{ minWidth: 240 }}>
                                                <label style={{ fontSize: 14, fontWeight: 600 }}>
                                                    Choose a color for the ID card
                                                </label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                                                    <input
                                                        type="color"
                                                        value={cardColor}
                                                        onChange={(e) => setCardColor(e.target.value)}
                                                        style={{ width: 52, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ fontSize: 14 }}>{cardColor}</span>
                                                </div>
                                                <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 2 }}>
                                                    Click the swatch to pick a color
                                                </div>
                                            </div>

                                            <div style={{ minWidth: 160, alignSelf: 'flex-end' }}>
                                                <label style={{ fontSize: 14, fontWeight: 600 }}>Students</label>
                                                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                                                    {students.length}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                                            <button
                                                type="button"
                                                onClick={handlePreview}
                                                disabled={isBusy}
                                                className={[dashboard['btn'], dashboard['btn--primary']].join(' ')}
                                                style={{ padding: '10px 18px', fontSize: 14 }}
                                            >
                                                {previewing ? 'Preparing…' : 'Preview PDF'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDownload}
                                                disabled={isBusy || !selectedClassId || students.length === 0}
                                                className={[dashboard['btn'], dashboard['btn--accent']].join(' ')}
                                                style={{ padding: '10px 18px', fontSize: 14 }}
                                            >
                                                {generating ? 'Generating…' : 'Download PDF'}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ fontWeight: 700, color: '#0e387a', marginBottom: 8, fontSize: 16 }}>
                                        Sample preview
                                    </div>
                                    <SampleCard
                                        color={cardColor}
                                        logoUrl={logoUrl}
                                        schoolName={school?.name || 'School Name'}
                                    />

                                </div>
                            </Box>
                        </Box>
                    </ClickAwayListener>

                    <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert onClose={() => setOpen(false)} severity={alertType} sx={{ width: "100%", fontSize: "1.6rem", padding: "16px", textAlign: "center" }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </>
    );
};

const SampleCard = ({ color, logoUrl, schoolName }) => (
    <div style={{
        width: 560,
        maxWidth: '100%',
        border: '1px solid #333',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#fff',
        color: '#111',
        fontSize: 12,
    }}>
        <div style={{ background: color, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {logoUrl ? <img src={logoUrl} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} /> : null}
            </div>
            <div style={{ flex: 1, color: '#fff', fontWeight: 700, textAlign: 'center', fontFamily: 'Oswald, Arial' }}>
                {schoolName}
            </div>
            <div style={{ color: '#fff', fontSize: 11, fontFamily: 'Oswald, Arial', letterSpacing: 1 }}>
                STUDENT ID
            </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: 10 }}>
            <div style={{ width: 90 }}>
                <div style={{ width: 84, height: 100, border: '1px solid #555', background: '#f4f4f4' }} />
                <div style={{ textAlign: 'center', color: '#777', fontSize: 10, marginTop: 6 }}>
                    _____________
                </div>
                <div style={{ textAlign: 'center', color: '#777', fontSize: 9 }}>
                    Authorized Signature
                </div>
            </div>

            <div style={{ flex: 1, fontSize: 12, lineHeight: 1.6 }}>
                <div><strong>Name:</strong> John Doe</div>
                <div><strong>Reg No:</strong> STU/2024/0001</div>
                <div><strong>Class:</strong> Sample Class</div>
                <div><strong>Gender:</strong> MALE</div>
            </div>

            <div style={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: 80, height: 80, border: '1px dashed #999',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#888',
                }}>
                    QR
                </div>
                <div style={{ fontSize: 9, color: '#666', marginTop: 4 }}>SCAN</div>
            </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#888', paddingBottom: 6 }}>
            Generated by MiQwii Manager Student Portal
        </div>
    </div>
);

export default IDCardSetup;