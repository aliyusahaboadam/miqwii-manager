import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon } from '@mui/icons-material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Toolbar,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSettingsState, updateResultConfig } from '../../redux/reducer/settingsSlice';
import { default as dashboard, default as navbar } from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

// ---------------------------------------------------------------------
// Template options — must match the backend ResultTemplate enum exactly.
// ---------------------------------------------------------------------

const TEMPLATE_OPTIONS = [
  {
    value: 'DEFAULT_2CA_20_20_EXAM_60',
    label: 'CA1 (20) + CA2 (20) + Exam (60)',
  },
  {
    value: 'THREE_TESTS_ONE_ASSIGNMENT_EXAM_60',
    label: 'Test 1 (10) + Test 2 (10) + Test 3 (10) + Assignment (10) + Exam (60)',
  },
  {
    value: 'TWO_TESTS_ONE_ASSIGNMENT_EXAM_70',
    label: 'Test 1 (10) + Test 2 (10) + Assignment (10) + Exam (70)',
  },
  {
    value: 'TEST_20_ASSIGNMENT_20_EXAM_60',
    label: 'Test (20) + Assignment (20) + Exam (60)',
  },
];

const SECTION_FIELDS = [
  { key: 'crecheTemplate', label: 'Creche' },
  { key: 'kgTemplate', label: 'KG' },
  { key: 'nurseryTemplate', label: 'Nursery' },
  { key: 'primaryTemplate', label: 'Primary' },
  { key: 'secondaryTemplate', label: 'Secondary' },
];

// ---------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------

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
  [theme.breakpoints.up('sm')]: { maxWidth: '560px' },
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
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------

const AssessmentScheme = () => {
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
  // Redux state
  // ---------------------------------------------------------------------

  const crecheTemplate = useSelector((s) => s.settings.crecheTemplate);
  const kgTemplate = useSelector((s) => s.settings.kgTemplate);
  const nurseryTemplate = useSelector((s) => s.settings.nurseryTemplate);
  const primaryTemplate = useSelector((s) => s.settings.primaryTemplate);
  const secondaryTemplate = useSelector((s) => s.settings.secondaryTemplate);
  const fetchingStatus = useSelector((s) => s.settings.fetchingStatus);
  const updatingStatus = useSelector((s) => s.settings.updatingStatus);
  const settingsError = useSelector((s) => s.settings.error);

  // ---------------------------------------------------------------------
  // Local form state — the admin's in-progress edits.
  // ---------------------------------------------------------------------

  const [form, setForm] = useState({
    crecheTemplate: 'DEFAULT_2CA_20_20_EXAM_60',
    kgTemplate: 'DEFAULT_2CA_20_20_EXAM_60',
    nurseryTemplate: 'DEFAULT_2CA_20_20_EXAM_60',
    primaryTemplate: 'DEFAULT_2CA_20_20_EXAM_60',
    secondaryTemplate: 'DEFAULT_2CA_20_20_EXAM_60',
  });

  useEffect(() => {
    setForm({
      crecheTemplate: crecheTemplate || 'DEFAULT_2CA_20_20_EXAM_60',
      kgTemplate: kgTemplate || 'DEFAULT_2CA_20_20_EXAM_60',
      nurseryTemplate: nurseryTemplate || 'DEFAULT_2CA_20_20_EXAM_60',
      primaryTemplate: primaryTemplate || 'DEFAULT_2CA_20_20_EXAM_60',
      secondaryTemplate: secondaryTemplate || 'DEFAULT_2CA_20_20_EXAM_60',
    });
  }, [crecheTemplate, kgTemplate, nurseryTemplate, primaryTemplate, secondaryTemplate]);

  // ---------------------------------------------------------------------
  // Alert + confirm dialog state
  // ---------------------------------------------------------------------

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // ---------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------

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

  // ---------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = () =>
    form.crecheTemplate !== crecheTemplate ||
    form.kgTemplate !== kgTemplate ||
    form.nurseryTemplate !== nurseryTemplate ||
    form.primaryTemplate !== primaryTemplate ||
    form.secondaryTemplate !== secondaryTemplate;

  const changedSections = () => {
    const list = [];
    if (form.crecheTemplate !== crecheTemplate) list.push('Creche');
    if (form.kgTemplate !== kgTemplate) list.push('KG');
    if (form.nurseryTemplate !== nurseryTemplate) list.push('Nursery');
    if (form.primaryTemplate !== primaryTemplate) list.push('Primary');
    if (form.secondaryTemplate !== secondaryTemplate) list.push('Secondary');
    return list;
  };

  const handleSaveClick = () => {
    if (!hasChanges()) {
      setAlertType('error');
      setMessage('No changes to save.');
      setOpen(true);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setConfirmOpen(false);
    try {
      await dispatch(
        updateResultConfig({
          crecheTemplate: form.crecheTemplate,
          kgTemplate: form.kgTemplate,
          nurseryTemplate: form.nurseryTemplate,
          primaryTemplate: form.primaryTemplate,
          secondaryTemplate: form.secondaryTemplate,
        })
      ).unwrap();

      setAlertType('success');
      setMessage('Assessment templates updated. Existing scores were recomputed.');
      setOpen(true);
    } catch (err) {
      // reducer already set state.error; effect opens dialog
    }
  };

  const isLoading = fetchingStatus === 'loading' && !updatingStatus;
  const changed = changedSections();

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {/* Navbar */}
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

          {/* Drawer */}
          <SchoolDrawer
            isLargeScreen={isLargeScreen}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            logout={logout}
          />

          {/* Main */}
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
                  {isLoading ? 'Loading...' : 'Assessment Settings'}
                </p>

                <p style={{ fontSize: '1.4rem', color: '#555', marginTop: 0 }}>
                  Choose the mark breakdown for each section. Saving will
                  recompute existing scores for the sections you changed.
                </p>

                {SECTION_FIELDS.map(({ key, label }) => (
                  <FormControl key={key} fullWidth size="medium" sx={{ marginBottom: 1.5 }}>
                    <InputLabel sx={{ fontSize: '1.6rem' }}>{label}</InputLabel>
                    <Select
                      value={form[key]}
                      label={label}
                      onChange={(e) => handleChange(key, e.target.value)}
                      sx={{
                        fontSize: '1.4rem',
                        '& .MuiSelect-select': { fontSize: '1.4rem' },
                      }}
                    >
                      {TEMPLATE_OPTIONS.map((opt) => (
                        <MenuItem
                          key={opt.value}
                          value={opt.value}
                          sx={{ fontSize: '1.3rem' }}
                        >
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}

                <Button
                  variant="contained"
                  size="large"
                  disabled={updatingStatus === 'loading' || !hasChanges()}
                  onClick={handleSaveClick}
                  sx={{
                    marginTop: 2,
                    fontSize: '1.6rem',
                    backgroundColor: '#0e387a',
                    '&:hover': { backgroundColor: '#0c3371' },
                  }}
                >
                  {updatingStatus === 'loading' ? 'Saving...' : 'Save Templates'}
                </Button>
              </Card>
            </SignInContainer>
          </Box>
        </Box>
      </ClickAwayListener>

      {/* Confirm dialog — sits outside ClickAwayListener */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={{ p: 3, minWidth: 400 }}>
          <h3 style={{ marginTop: 0 }}>Save Assessment Templates</h3>
          <p style={{ color: '#4a4a4a', fontSize: '1.4rem' }}>
            This will recompute existing scores for the following section
            {changed.length === 1 ? '' : 's'}:
          </p>
          <ul style={{ color: '#0e387a', fontSize: '1.4rem' }}>
            {changed.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p style={{ color: '#7a1f1f', fontSize: '1.3rem' }}>
            The recompute may take a few seconds on large classes. Continue?
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirmSave}>
              Confirm
            </Button>
          </div>
        </Box>
      </Dialog>

      {/* Alert dialog */}
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

export default AssessmentScheme;