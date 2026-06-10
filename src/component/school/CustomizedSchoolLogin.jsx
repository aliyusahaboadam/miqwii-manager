import { Alert, Snackbar } from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { loginRequest } from '../../redux/reducer/loginSlice';
import style from '../style/form/CustomizedSchoolLogin.module.css';

/* ─── Role configuration ──────────────────────────────────── */
const ROLES = [
  { id: 1, text: 'Student',  icon: '🎓', placeholder: 'e.g. student2026_id' },
  { id: 2, text: 'Teacher',  icon: '📚', placeholder: 'e.g. t.surname'       },
  { id: 3, text: 'Admin',    icon: '🏛️', placeholder: 'e.g. admin.username'  },
];

/* ─── Validation schema ───────────────────────────────────── */
const loginSchema = object({
  username: string()
    .max(60, 'ID must not exceed 60 characters')
    .required('ID is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

/* ─── Icons ───────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ─── Shield placeholder SVG ─────────────────────────────── */
const ShieldPlaceholder = () => (
  <div className={style.logoPlaceholder}>
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 1L2 8v14c0 9.4 6.9 18.2 16 20 9.1-1.8 16-10.6 16-20V8L18 1z"
        fill="rgba(201,168,76,0.15)"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />
      <text x="18" y="27" textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="14" fontWeight="700" fill="#C9A84C">
        S
      </text>
    </svg>
    <span className={style.logoPlaceholderText}>LOGO</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SchoolLogin Component
═══════════════════════════════════════════════════════════ */
const CustomizedSchoolLogin = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  /* Role state */
  const [activeRoleId, setActiveRoleId] = useState(ROLES[0].id);
  const activeRole = ROLES.find(r => r.id === activeRoleId);

  /* Password visibility */
  const [showPassword, setShowPassword] = useState(false);

  /* Snackbar */
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });

  const closeSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /* Submit handler */
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const body = await dispatch(loginRequest(values)).unwrap();
      localStorage.setItem('token', JSON.stringify(body.jwt));
      localStorage.setItem('authenticated', JSON.stringify(true));

      if (body.redirectUrl !== 'error') {
        navigate(body.redirectUrl);
      }
    } catch (error) {
      localStorage.setItem('authenticated', JSON.stringify(false));
      setSnackbar({ open: true, type: 'error', message: error.message });
    }
    resetForm();
  };

  return (
    <div className={style.signInContainer}>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur }) => (

          <div className={style.card}>

            {/* ── Card Header ── */}
            <div className={style.cardHeader}>

              {/* Logo */}
              <div className={style.logoZone}>
                {/* Swap ShieldPlaceholder for <img src="/images/logo.png" alt="Logo" /> when ready */}
                <ShieldPlaceholder />
              </div>

              <p className={style.schoolName}>Sunrise Academy</p>
              <p className={style.schoolMotto}>"Knowledge · Character · Excellence"</p>
              <p className={style.schoolAddress}>
                14 Education Boulevard, Greenfield District<br />
                P.O. Box 1042 · info@sunriseacademy.edu · +1 (800) 555-0192
              </p>
            </div>

            {/* ── Gold diamond divider ── */}
            <div className={style.divider}>
              <div className={style.dividerLine} />
              <div className={style.dividerDiamond} />
              <div className={style.dividerLineRight} />
            </div>

            {/* ── Card Body ── */}
            <div className={style.cardBody}>

              <p className={style.loginLabel}>Portal Sign In</p>

              {/* Role selector tabs */}
              <div className={style.roleTabs} role="tablist" aria-label="Login as">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    role="tab"
                    aria-selected={role.id === activeRoleId}
                    className={[
                      style.roleTab,
                      role.id === activeRoleId ? style.roleTabActive : '',
                    ].join(' ')}
                    onClick={() => setActiveRoleId(role.id)}
                  >
                    <span className={style.roleIcon}>{role.icon}</span>
                    {role.text}
                  </button>
                ))}
              </div>

              {/* Username field */}
              <div className={style.field}>
                <label htmlFor="username" className={style.fieldLabel}>
                  {activeRole.text} Username
                </label>
                <div className={style.fieldWrap}>
                  <span className={style.fieldIcon}><UserIcon /></span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    className={[
                      style.fieldInput,
                      touched.username && errors.username ? style.fieldInputError : '',
                    ].join(' ')}
                    placeholder={activeRole.placeholder}
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.username && errors.username && (
                  <p className={style.errorText}>{errors.username}</p>
                )}
              </div>

              {/* Password field */}
              <div className={style.field}>
                <label htmlFor="password" className={style.fieldLabel}>Password</label>
                <div className={style.fieldWrap}>
                  <span className={style.fieldIcon}><LockIcon /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={[
                      style.fieldInput,
                      touched.password && errors.password ? style.fieldInputError : '',
                    ].join(' ')}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className={style.passwordToggle}
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className={style.errorText}>{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={style.btnLogin}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Please wait…' : `Sign in as ${activeRole.text}`}
              </button>

              {/* Links */}
              <div className={style.formLinkContainer}>
                <span className={style.formLink}>
                  New school?{' '}
                  <a className={style.linkRegister} href="/school/register">Register here</a>
                </span>
                <span className={style.formLink}>
                  <a className={style.linkRegister} href="/password/password-request">
                    Forgot password?
                  </a>
                </span>
              </div>

            </div>{/* end cardBody */}

            {/* ── Card Footer ── */}
            <div className={style.cardFooter}>
              © 2026 Sunrise Academy · All rights reserved ·{' '}
              <a href="#" className={style.footerLink}>Privacy Policy</a>
            </div>

          </div>
        )}
      </Formik>

   

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.type || 'info'}
          sx={{ width: '100%', fontSize: '1rem', padding: '12px 16px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default CustomizedSchoolLogin;
