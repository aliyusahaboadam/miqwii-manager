import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon } from '@mui/icons-material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  AppBar,
  Box,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  Toolbar,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSettingsState, updateResultConfig } from '../../redux/reducer/settingsSlice';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: 'auto',
  maxHeight: 'auto',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  borderRadius: '10px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '520px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: 'rgba(10, 40, 89)',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='251' height='251' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%230E387A' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230E387A'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
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

const ResultSettings = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/school/login');
    localStorage.setItem('authenticated', JSON.stringify(false));
  };

  // ---------------------------------------------------------------------
  // Redux state — 5 layout flags
  // ---------------------------------------------------------------------
  const disablePositioning = useSelector((s) => s.settings.disablePositioning);
  const disableTeacherRemark = useSelector((s) => s.settings.disableTeacherRemark);
  const disableNextTermFees = useSelector((s) => s.settings.disableNextTermFees);
  const disableQrCode = useSelector((s) => s.settings.disableQrCode);
  const disableTermPerformanceSummary = useSelector(
    (s) => s.settings.disableTermPerformanceSummary
  );

  const fetchingStatus = useSelector((s) => s.settings.fetchingStatus);
  const updatingStatus = useSelector((s) => s.settings.updatingStatus);
  const settingsError = useSelector((s) => s.settings.error);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getSettingsState());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (settingsError && (fetchingStatus === 'failed' || updatingStatus === 'failed')) {
      setAlertType('error');
      setMessage(settingsError);
      setOpen(true);
    }
  }, [settingsError, fetchingStatus, updatingStatus]);

  // switch ON  → user wants the feature enabled → send disableX = false
  // switch OFF → user wants the feature disabled → send disableX = true
  const persist = async (field, enabled) => {
    try {
      await dispatch(updateResultConfig({ [field]: !enabled })).unwrap();
      setAlertType('success');
      setMessage('Setting updated');
      setOpen(true);
    } catch (err) {
      // reducer already set state.error
    }
  };

  const handleTogglePositioning = (e) => persist('disablePositioning', e.target.checked);
  const handleToggleTeacherRemark = (e) => persist('disableTeacherRemark', e.target.checked);
  const handleToggleNextTermFees = (e) => persist('disableNextTermFees', e.target.checked);
  const handleToggleQrCode = (e) => persist('disableQrCode', e.target.checked);
  const handleToggleTermPerfSummary = (e) =>
    persist('disableTermPerformanceSummary', e.target.checked);

  const isLoading = fetchingStatus === 'loading' && !updatingStatus;

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          <AppBar position="fixed" sx={{ zIndex: 2, background: 'white', color: '#0e387a' }}>
            <Toolbar sx={{ zIndex: 2, display: 'flex', justifyContent: 'space-between' }}>
              {!isLargeScreen && (
                <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                  <MenuIcon sx={{ color: 'inherit', fontSize: 30 }} />
                </IconButton>
              )}
              <div>
                <IconButton
                  onClick={profilePopup}
                  sx={{
                    backgroundColor: '#0e387a',
                    '&:hover': { backgroundColor: '#0c3371' },
                  }}
                >
                  <PersonOutlineOutlinedIcon sx={{ color: 'white', fontSize: 25 }} />
                </IconButton>

                <BasePopup
                  sx={{ zIndex: 2 }}
                  id={idProfile}
                  open={openProfile}
                  anchor={anchorProfile}
                >
                  <div className={navbar['profile--selection__container']}>
                    <div className={navbar['profile']}>
                      <a
                        href="/school/school-profile"
                        className={[navbar['link--profile'], navbar['']].join(' ')}
                      >
                        Profile
                      </a>
                    </div>
                    <div className={navbar['logout']}>
                      <a
                        onClick={logout}
                        className={[navbar['link--profile'], navbar['']].join(' ')}
                      >
                        Logout
                      </a>
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

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              marginTop: 8,
              fontSize: 23,
              overflowX: 'auto',
              width: '100%',
              color: '#9a99ac',
              transition: 'margin-left 0.3s ease-in-out',
            }}
          >
            <SignInContainer>
              <Card>
                <section className={style.container__brand}>
                  <img src="/images/logo.png" alt="Logo" />
                </section>

                <p className={style['form-header']}>
                  {isLoading ? 'Loading...' : 'Result Layout Settings'}
                </p>

                <p style={{ fontSize: '1.4rem', color: '#555', marginTop: 0 }}>
                  Control what appears on the printed report sheet.
                </p>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={!disablePositioning}
                        onChange={handleTogglePositioning}
                        sx={{ transform: 'scale(1.2)', marginRight: 1 }}
                      />
                    }
                    label={`${disablePositioning ? 'Disabled' : 'Enabled'} Positioning`}
                    sx={{ '.MuiFormControlLabel-label': { fontSize: '1.8rem' } }}
                  />

                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={!disableTeacherRemark}
                        onChange={handleToggleTeacherRemark}
                        sx={{ transform: 'scale(1.2)', marginRight: 1 }}
                      />
                    }
                    label={`${disableTeacherRemark ? 'Disabled' : 'Enabled'} Teacher's Remark`}
                    sx={{ '.MuiFormControlLabel-label': { fontSize: '1.8rem' } }}
                  />

                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={!disableNextTermFees}
                        onChange={handleToggleNextTermFees}
                        sx={{ transform: 'scale(1.2)', marginRight: 1 }}
                      />
                    }
                    label={`${disableNextTermFees ? 'Disabled' : 'Enabled'} Next Term Fees`}
                    sx={{ '.MuiFormControlLabel-label': { fontSize: '1.8rem' } }}
                  />

                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={!disableQrCode}
                        onChange={handleToggleQrCode}
                        sx={{ transform: 'scale(1.2)', marginRight: 1 }}
                      />
                    }
                    label={`${disableQrCode ? 'Disabled' : 'Enabled'} QR Code`}
                    sx={{ '.MuiFormControlLabel-label': { fontSize: '1.8rem' } }}
                  />

                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={!disableTermPerformanceSummary}
                        onChange={handleToggleTermPerfSummary}
                        sx={{ transform: 'scale(1.2)', marginRight: 1 }}
                      />
                    }
                    label={`${
                      disableTermPerformanceSummary ? 'Disabled' : 'Enabled'
                    } Term Performance Summary`}
                    sx={{ '.MuiFormControlLabel-label': { fontSize: '1.8rem' } }}
                  />
                </FormGroup>

                <div className={style.footer__brand}>
                  <img src="/images/logo.png" alt="" />
                  <p className={style.footer__copyright}>
                    (c) 2026 Miqwii, All Rights Reserved
                  </p>
                </div>
              </Card>
            </SignInContainer>
          </Box>
        </Box>
      </ClickAwayListener>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            BackdropProps={{ sx: { backgroundColor: 'rgba(157, 152, 202, 0.5)' } }}
            sx={{ '& .MuiDialog-paper': { width: '100%', borderRadius: '15px' } }}
          >
            {alertType === 'success' ? (
              <div
                style={{ width: '100%', background: '#fff' }}
                className={[dashboard['card--alert-success']].join(' ')}
              >
                <div className={dashboard['card_body']}>
                  <span
                    className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}
                  >
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg
                      className={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}
                    >
                      <use href="/images/sprite.svg#success-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>success</p>
              </div>
            ) : (
              <div
                style={{ width: '100%', background: '#fff' }}
                className={[dashboard['card--alert-error']].join(' ')}
              >
                <div className={dashboard['card_body']}>
                  <span
                    className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}
                  >
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg className={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                      <use href="/images/sprite.svg#error-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>error</p>
              </div>
            )}
          </Dialog>
        </div>
      </Snackbar>
    </>
  );
};

export default ResultSettings;