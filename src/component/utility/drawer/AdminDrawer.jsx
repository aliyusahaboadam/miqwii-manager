// File: src/component/utility/drawer/AdminDrawer.jsx
import { Cancel } from "@mui/icons-material";
import { Box, Drawer, IconButton, List } from "@mui/material";
import { useState } from "react";
import navbar from '../../style/dashboard/SchoolDashboard.module.css';

const AdminDrawer = ({ isLargeScreen, isDrawerOpen, toggleDrawer, logout }) => {

    const [activeChevron, setActiveChevron] = useState(null);

    const toggleChevron = (id) =>
        setActiveChevron((prev) => (prev === id ? null : id));

    const chevron = (
        <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
            <use href="/images/sprite.svg#chevron"></use>
        </svg>
    );

    const headerClass = (id) =>
        [navbar['collapsible'], navbar[activeChevron === id ? 'collapsible--expanded' : null]].join(' ');

    return (
        <Drawer
            variant={isLargeScreen ? "persistent" : "temporary"}
            open={isLargeScreen || isDrawerOpen}
            onClose={!isLargeScreen ? toggleDrawer : undefined}
            sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
                "& .MuiBackdrop-root": { backgroundColor: "rgba(157, 152, 202, 0.3)" },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #ddd",
                }}
            >
                <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                    <a className={[navbar["logo__link"], navbar["logo"]].join(' ')} href="#">
                        <img src="/images/logo.png" alt="miqwii logo" />
                    </a>
                </Box>
                {!isLargeScreen && (
                    <IconButton onClick={toggleDrawer}>
                        <Cancel sx={{ color: "#0e387a", fontSize: 30 }} />
                    </IconButton>
                )}
            </Box>

            <List>

                {/* Dashboard */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-0')} className={headerClass('chevron-0')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#dashboard"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Dashboard</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-0')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/admin/home" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Home</a>
                        <a href="/admin/schools" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Schools</a>
                        <a href="/admin/all-session" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Sessions</a>
                    </div>
                </div>

                {/* Profile */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-9')} className={headerClass('chevron-9')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#profile"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Profile</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-9')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/admin/profile" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Profile</a>
                        <a onClick={logout} className={navbar['link--drawer']}>Logout</a>
                    </div>
                </div>

            </List>
        </Drawer>
    );
};

export default AdminDrawer;