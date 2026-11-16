// File: src/component/school/UploadSchoolLogo.jsx
import { Close as Cancel } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Snackbar } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadLogo } from '../../redux/reducer/schoolSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolRegistration.module.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  borderRadius: '10px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
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
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const UploadSchoolLogo = () => {

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  // ---- File selection state ----
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  // ---- File pick with validation ----
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Size check
    if (file.size > 5 * 1024 * 1024) {
      setAlertType("error");
      setMessage("File too large. Maximum 5 MB.");
      setOpen(true);
      event.target.value = "";
      return;
    }

    // Type check
    if (!file.type.startsWith("image/")) {
      setAlertType("error");
      setMessage("Please select an image file (jpg, png, etc.)");
      setOpen(true);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Live preview via object URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---- Submit ----
  const handleFormSubmit = async () => {
    if (!selectedFile) {
      setAlertType("error");
      setMessage("Please select a logo image first.");
      setOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const body = await dispatch(uploadLogo(formData)).unwrap();
      setAlertType("success");
      setMessage(body.message || "Logo uploaded successfully");
      setOpen(true);
      handleRemoveSelected();
    } catch (error) {
      setAlertType('error');
      setMessage(error.message || "Failed to upload logo");
      setOpen(true);
    }
  };

  return (
    <SignInContainer>
      <Formik
        initialValues={{ image: "", imageName: "" }}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Card>

            {/* Card Image */}
            <section className={style.container__brand}>
              <img src="/images/logo.png" alt="Logo" />
            </section>

            {/* Card Header */}
            <p className={style['form-header']}>Upload School Logo</p>

            {/* ================= Logo Upload Block ================= */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  position: 'relative',
                }}
                title="Click to select logo"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: 'contain',
                      borderRadius: 12,
                      border: '2px solid #eee',
                      padding: 8,
                      background: '#fff',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 12,
                      border: '2px dashed #ccc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f9f9f9',
                      color: '#9a99ac',
                      fontSize: 13,
                      gap: 6,
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 32, color: '#9a99ac' }} />
                    No file selected
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div style={{ marginTop: 8, fontSize: 13, color: '#9a99ac' }}>
                {selectedFile ? (
                  <>
                    <span style={{ color: '#0e387a', fontWeight: 600 }}>
                      {selectedFile.name}
                    </span>
                    {'  ·  '}
                    <span
                      onClick={handleRemoveSelected}
                      style={{ color: '#F44336', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Remove
                    </span>
                  </>
                ) : (
                  <>Click the box to select a logo (max 5 MB)</>
                )}
              </div>
            </div>
            {/* ================= End Logo Upload Block ================= */}

            {/* Submit */}
            <button
              disabled={isSubmitting || !selectedFile}
              type="submit"
              onClick={handleSubmit}
              className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Logo'}
            </button>

          </Card>
        )}
      </Formik>

      <div className={style.footer__brand}>
        <img src="/images/logo.png" alt="" />
        <p className={style.footer__copyright}>(c) 2026 Miqwii, All Rights Reserved</p>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }}
            sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}
          >
            {alertType === 'success' ? (
              <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-success']].join(' ')}>
                <div className={dashboard['card_body']}>
                  <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg className={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                      <use href="/images/sprite.svg#success-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>success</p>
              </div>
            ) : (
              <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-error']].join(' ')}>
                <div className={dashboard['card_body']}>
                  <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
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
    </SignInContainer>
  );
};

export default UploadSchoolLogo;