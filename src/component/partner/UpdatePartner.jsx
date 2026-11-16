// File: src/component/partner/UpdatePartner.jsx
import { Close as Cancel } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';
import {
    getPartnerById,
    resetStatus,
    updatePartner,
} from '../../redux/reducer/partnerSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolRegistration.module.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: '450px',
  maxHeight: '77vh',
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
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#0A2859',
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
  },
}));

const UpdatePartner = () => {
  const { id } = useParams();

  const partnerSchema = object({
    partnerName: string()
      .min(3, "Partner name too short")
      .max(100, "Partner name must not exceed 100 characters")
      .required("Partner name is required"),

    location: string().max(100, "Location must not exceed 100 characters"),

    splitterCode: string().max(64, "Splitter code must not exceed 64 characters"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    partnerName: "",
    location: "",
    splitterCode: "",
  });

  // ---- Logo file state (lives outside Formik — it's a File, not a string) ----
  const [existingLogoUrl, setExistingLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const partnerState = useSelector((state) => state.partner);
  const { partner, fetchingStatus } = partnerState;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // ---- Load partner on mount ----
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    dispatch(getPartnerById(id))
      .unwrap()
      .then((result) => {
        setInitialValues({
          partnerName: result.partnerName || "",
          location: result.location || "",
          splitterCode: result.splitterCode || "",
        });
        setExistingLogoUrl(result.logoUrl || "");
      })
      .catch((err) => {
        setAlertType("error");
        setMessage(typeof err === 'string' ? err : (err?.message || "Failed to load partner"));
        setOpen(true);
      })
      .finally(() => setLoading(false));

    return () => dispatch(resetStatus());
  }, [id, dispatch]);

  // ---- Handle logo file pick ----
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAlertType("error");
      setMessage("File too large. Maximum 5 MB.");
      setOpen(true);
      event.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAlertType("error");
      setMessage("Please select an image file (jpg, png, etc.)");
      setOpen(true);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Object URL for instant preview (revoke later in useEffect cleanup if you want)
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
  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("partnerName", values.partnerName || "");
      formData.append("location", values.location || "");
      formData.append("splitterCode", values.splitterCode || "");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      // If no file → backend keeps existing logoUrl

      const body = await dispatch(updatePartner({ id, formData })).unwrap();

      setAlertType("success");
      setMessage(body?.message || "Partner updated successfully");
      setOpen(true);

      setTimeout(() => navigate('/admin/partners'), 1500);
    } catch (error) {
      setAlertType('error');
      setMessage(typeof error === 'string' ? error : (error?.message || "Failed to update partner"));
      setOpen(true);
    }
  };

  // ---- Spinner while loading ----
  if (loading || (fetchingStatus === 'loading' && !partner)) {
    return <Loading />;
  }

  // Logo to display: new preview > existing > placeholder
  const displayLogo = previewUrl || existingLogoUrl;

  return (
    <SignInContainer>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={partnerSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          errors,
          handleChange,
          handleSubmit,
          values,
          isSubmitting,
          touched,
          handleBlur,
        }) => (
          <Card>

            {/* Card Image */}
            <section className={style.container__brand}>
              <img src="/images/logo.png" alt="Logo" />
            </section>

            {/* Card Header */}
            <p className={style['form-header']}>Update Partner</p>

            {/* ---------- Logo Upload Block ---------- */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  position: 'relative',
                }}
                title="Click to change logo"
              >
                {displayLogo ? (
                  <img
                    src={displayLogo}
                    alt="Partner Logo"
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: 'contain',
                      borderRadius: 12,
                      border: '2px solid #eee',
                      padding: 8,
                      background: '#fff',
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
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
                    No logo
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
                  <>
                    Click image to {existingLogoUrl ? 'change' : 'upload'} logo (max 5 MB)
                  </>
                )}
              </div>
            </div>

            {/* Partner Name */}
            <TextField
              label="Partner Name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.partnerName}
              name='partnerName'
              error={touched.partnerName && Boolean(errors.partnerName)}
              helperText={touched.partnerName && errors.partnerName}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Location */}
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.location}
              name='location'
              error={touched.location && Boolean(errors.location)}
              helperText={touched.location && errors.location}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Splitter Code */}
            <TextField
              label="Splitter Code (optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.splitterCode}
              name='splitterCode'
              error={touched.splitterCode && Boolean(errors.splitterCode)}
              helperText={touched.splitterCode && errors.splitterCode}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
            >
              {isSubmitting ? 'Updating Partner...' : 'Update Partner'}
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
                      <use href="../images/sprite.svg#success-icon"></use>
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
                      <use href="../images/sprite.svg#error-icon"></use>
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

export default UpdatePartner;