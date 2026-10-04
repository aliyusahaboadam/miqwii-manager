// File: src/component/utility/drawer/SchoolDrawer.jsx
import { Cancel } from "@mui/icons-material";
import { Box, Drawer, IconButton, List } from "@mui/material";
import { useState } from "react";
import navbar from '../../style/dashboard/SchoolDashboard.module.css';

const SchoolDrawer = ({ isLargeScreen, isDrawerOpen, toggleDrawer, logout }) => {

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
            {/* Header */}
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
                        <a href="/school/home" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Home</a>
                        <a href="/school/upload-school-logo" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Add School Logo</a>
                    </div>
                </div>


                 {/* Session */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-12')} className={headerClass('chevron-12')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#session"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Sessions</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-12')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        
                        <a href="/session/setup-session" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Setup Session</a>
                        <a href="/session/update-session" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Resumption / Fee</a>
                       
                    </div>
                </div>

                {/* Students */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-1')} className={headerClass('chevron-1')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#student"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Students</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-1')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/student/add-student" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Add Student</a>
                        <a href="/student/view-students" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>View Students</a>
                        <a href="/school/student-activator" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Student Account</a>
                    </div>
                </div>

                {/* Classes */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-2')} className={headerClass('chevron-2')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#class"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Classes</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-2')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                  <div className={navbar['collapsible__content--drawer']}>
    {/* ---------- Class views ---------- */}

    <a href="/class/nursery-classes" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Nursery Classes</a>
    <a href="/class/primary-classes" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Primary Classes</a>
    <a href="/class/secondary-classes" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Secondary Classes</a>
        <a href="/class/creche-classes" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Creche Classes</a>
    <a href="/class/kg-classes" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>KG Classes</a>
    {/* ---------- Add class ---------- */}
    <a href="/class/add-class" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Add Class</a>
</div>
                </div>

                {/* Subjects */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-3')} className={headerClass('chevron-3')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#subject"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Subjects</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-3')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/subject/view-subjects" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>View Subjects</a>
                        <a href="/subject/add-subjects" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Add Subjects</a>
                    </div>
                </div>

                {/* Teachers */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-4')} className={headerClass('chevron-4')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#teacher"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Teachers</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-4')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/teacher/add-teacher" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Add Teacher</a>
                        <a href="/teacher/view-teachers" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>View Teachers</a>
                    </div>
                </div>

                {/* Results */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-6')} className={headerClass('chevron-6')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#result"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Results</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-6')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/result/show-results" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Generate Result</a>
                        <a href="/result/show-mastersheet" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>View Master Sheet</a>
                        <a href="/result/student-result-by-regNo" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Search Result</a>
                    </div>
                </div>

                {/* School Fees */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-7')} className={headerClass('chevron-7')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#fee"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>School Fees</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-7')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/receipt/view-student-reciept" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>School Fees</a>
                    </div>
                </div>




                
              {/* Attendance */}
<div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-14')} className={headerClass('chevron-14')}>
    <header className={navbar['collapsible__header']}>
        <div className={navbar['collapsible__icon']}>
            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                <use href="/images/sprite.svg#attendance"></use>
            </svg>
            <p className={navbar['collapsible__heading']}>Attendance</p>
        </div>
        <span onClick={() => toggleChevron('chevron-14')} className={navbar['icon-container']}>{chevron}</span>
    </header>
    <div className={navbar['collapsible__content--drawer']}>
        <a href="/attendance/week" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Mark Attendance</a>
        <a href="/attendance/teaching-days" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Teaching Days</a>
        <a href="/attendance/export" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Export Record</a>
    </div>
</div>

                {/* Promotion */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-10')} className={headerClass('chevron-10')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#promotion"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Promotion</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-10')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/promotion/setup" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Promote Classes</a>
                        <a href="/promotion/selective" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Selective Promotion</a>
                        <a href="/promotion/history" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Promotion History</a>
                    </div>
                </div>

                {/* Graduation */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-11')} className={headerClass('chevron-11')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#graduation"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Graduation</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-11')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/graduation/graduate-class" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Graduate a Class</a>
                        <a href="/graduation/selective" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Selective Graduation</a>
                        <a href="/graduation/graduated-students" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Graduated Students</a>
                        <a href="/graduation/history" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Graduation History</a>
                    </div>
                </div>

                {/* Subscription */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-8')} className={headerClass('chevron-8')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#subscription"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Subscription</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-8')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/payment/pay-subscription" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Make Payment</a>
                        <a href="/payment/all-payments" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Payments History</a>
                    </div>
                </div>


                 {/* ID Card */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-13')} className={headerClass('chevron-13')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#idcard"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>ID Cards</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-13')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/student/id-card" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>View ID-Cards</a>
                       
                    </div>
                </div>

                {/* Settings */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-5')} className={headerClass('chevron-5')}>
                    <header className={navbar['collapsible__header']}>
                        <div className={navbar['collapsible__icon']}>
                            <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#settings"></use>
                            </svg>
                            <p className={navbar['collapsible__heading']}>Settings</p>
                        </div>
                        <span onClick={() => toggleChevron('chevron-5')} className={navbar['icon-container']}>{chevron}</span>
                    </header>
                    <div className={navbar['collapsible__content--drawer']}>
                        <a href="/settings/settings" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Settings</a>
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
                        <a href="/school/school-profile" className={navbar['link--drawer']} onClick={(e) => e.stopPropagation()}>Profile</a>
                        <a onClick={logout} className={navbar['link--drawer']}>Logout</a>
                    </div>
                </div>

            </List>
        </Drawer>
    );
};

export default SchoolDrawer;