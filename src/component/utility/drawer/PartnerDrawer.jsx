import { Cancel } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
} from "@mui/material";
import { useState } from "react";
import navbar from '../../style/dashboard/SchoolDashboard.module.css';

const PartnerDrawer = ({ isLargeScreen, isDrawerOpen, toggleDrawer, logout }) => {
  const [activeChevron, setActiveChevron] = useState(null);

  const toggleChevron = (id) => {
    setActiveChevron((prev) => (prev === id ? null : id));
  };

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
        {/* Dashboard group */}
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => toggleChevron('chevron-0')}
          className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ? 'collapsible--expanded' : null]].join(' ')}
        >
          <header className={navbar['collapsible__header']}>
            <div className={navbar['collapsible__icon']}>
              <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                <use href="../images/sprite.svg#dashboard"></use>
              </svg>
              <p className={navbar['collapsible__heading']}>Dashboard</p>
            </div>
            <span onClick={() => toggleChevron('chevron-0')} className={navbar['icon-container']}>
              <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
            </span>
          </header>
          <div className={navbar['collapsible__content--drawer']}>
            <a href="/partner/home" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Home</a>
            <a href="/partner/schools" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Schools</a>
            <a href="/partner/sessions" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Sessions</a>
          </div>
        </div>

        {/* Profile group */}
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => toggleChevron('chevron-9')}
          className={[navbar['collapsible'], navbar[activeChevron === 'chevron-9' ? 'collapsible--expanded' : null]].join(' ')}
        >
          <header className={navbar['collapsible__header']}>
            <div className={navbar['collapsible__icon']}>
              <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                <use href="/images/sprite.svg#profile"></use>
              </svg>
              <p className={navbar['collapsible__heading']}>Profile</p>
            </div>
            <span onClick={() => toggleChevron('chevron-9')} className={navbar['icon-container']}>
              <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
            </span>
          </header>
          <div className={navbar['collapsible__content--drawer']}>
            <a href="/partner/profile" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Profile</a>
            <a onClick={logout} className={[navbar['link--drawer'], navbar['']].join(' ')}>Logout</a>
          </div>
        </div>
      </List>
    </Drawer>
  );
};

export default PartnerDrawer;