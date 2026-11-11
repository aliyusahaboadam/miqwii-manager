import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { saveStudentAnswer, startExamAttempt, submitExamAttempt } from '../../redux/reducer/cbtSlice';
import styles from '../style/cbt/Cbt.module.css';

const StudentExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAttempt, answers, status } = useSelector(state => state.cbt);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);   // null = not hydrated

  // MUI message pattern
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [message, setMessage] = useState("");

  // Confirm-submit dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Prevent double submit
  const submittingRef = useRef(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // 1. Start exam attempt
  useEffect(() => {
    if (examId) dispatch(startExamAttempt(examId));
  }, [examId, dispatch]);

  // 2. Hydrate timer from backend's real deadline
  useEffect(() => {
    if (!currentAttempt) return;

    let remaining;
    if (currentAttempt.autoSubmitsAt) {
      const endsAt = new Date(currentAttempt.autoSubmitsAt).getTime();
      remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
    } else {
      remaining = (currentAttempt.durationMinutes || 0) * 60;
    }
    setTimeLeft(remaining);
  }, [currentAttempt]);

  // 3. Actual submit handler (no confirm here — confirm is done by caller)
  const doSubmit = useCallback(async (auto = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      await dispatch(submitExamAttempt(currentAttempt.attemptId)).unwrap();
      setAlertType(auto ? 'warning' : 'success');
      setMessage(auto ? 'Time up! Exam auto-submitted.' : 'Exam submitted successfully!');
      setOpen(true);
      // Go to login page (not blank dashboard)
      setTimeout(() => navigate('/cbt/student/submitted'), 1500);
    } catch (err) {
      submittingRef.current = false;
      setAlertType('error');
      setMessage(err?.message || 'Submit failed. Please try again.');
      setOpen(true);
    }
  }, [dispatch, currentAttempt, navigate]);

  // 4. Countdown — only after hydration
  useEffect(() => {
    if (timeLeft === null || !currentAttempt) return;

    if (timeLeft <= 0) {
      doSubmit(true);   // auto-submit at deadline
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentAttempt, doSubmit]);

  // Guards AFTER hooks
  if (status === 'loading' || !currentAttempt || timeLeft === null) {
    return <div style={{ padding: '2rem' }}>Loading Exam...</div>;
  }
  if (status === 'failed') {
    return <div style={{ padding: '2rem', color: 'red' }}>Error starting exam.</div>;
  }
  if (!currentAttempt.questions || currentAttempt.questions.length === 0) {
    return <div style={{ padding: '2rem' }}>No questions available for this exam.</div>;
  }

  const currentQ = currentAttempt.questions[currentQIndex];
  const currentAns = answers[currentQ.id] || {
    selectedOptions: null,
    isMarkedForReview: false,
    isVisited: false,
  };

  const handleSelectOption = (label) => {
    dispatch(saveStudentAnswer({
      attemptId: currentAttempt.attemptId,
      questionId: currentQ.id,
      selectedOptions: label,
      isMarkedForReview: currentAns.isMarkedForReview,
    }));
  };

  const handleMarkForReview = () => {
    const newStatus = !currentAns.isMarkedForReview;
    dispatch(saveStudentAnswer({
      attemptId: currentAttempt.attemptId,
      questionId: currentQ.id,
      selectedOptions: currentAns.selectedOptions,
      isMarkedForReview: newStatus,
    }));
  };

  // Finish button — opens confirm dialog instead of window.confirm
  const handleFinishClick = () => setConfirmOpen(true);

  const handleConfirmYes = () => {
    setConfirmOpen(false);
    doSubmit(false);
  };

  const handleConfirmNo = () => setConfirmOpen(false);

  const getPaletteClass = (qId) => {
    const ans = answers[qId];
    if (!ans || !ans.isVisited) return styles['palette-unvisited'];
    if (ans.isMarkedForReview) return styles['palette-marked'];
    if (ans.selectedOptions) return styles['palette-answered'];
    return styles['palette-visited'];
  };

  const formatTime = (seconds) => {
    if (seconds == null || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <div className={styles['cbt-container']}>
        {/* LEFT: QUESTION AREA */}
        <div className={styles['question-area']}>
          <div>
            <div className={styles['question-header']}>
              <div>
                <div className={styles['question-title']}>{currentAttempt.examName}</div>
                <button onClick={handleMarkForReview} style={{ marginTop: '10px', cursor: 'pointer' }}>
                  {currentAns.isMarkedForReview ? '⭐ Unmark Review' : '☆ Mark for Review'}
                </button>
              </div>
              <div className={styles['timer-box']}>{formatTime(timeLeft)}</div>
            </div>

            <div className={styles['question-text']}>
              <strong>Q{currentQIndex + 1}.</strong> {currentQ.questionText}
            </div>

            <div className={styles['options-list']}>
              {currentQ.options.map(opt => (
                <div
                  key={opt.optionLabel}
                  className={`${styles['option-item']} ${currentAns.selectedOptions === opt.optionLabel ? styles['selected'] : ''}`}
                  onClick={() => handleSelectOption(opt.optionLabel)}
                >
                  <div className={styles['option-label']}>{opt.optionLabel}</div>
                  <div>{opt.optionText}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles['nav-controls']}>
            <div>
              <button
                className={`${styles['btn-nav']} ${styles['btn-prev']}`}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                disabled={currentQIndex === 0}
              >
                Previous
              </button>
              <button
                className={`${styles['btn-nav']} ${styles['btn-skip']}`}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                style={{ marginLeft: '1rem' }}
              >
                Skip
              </button>
            </div>
            <div>
              <button
                className={`${styles['btn-nav']} ${styles['btn-next']}`}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                disabled={currentQIndex === currentAttempt.questions.length - 1}
              >
                Next
              </button>
              <button
                className={`${styles['btn-nav']} ${styles['btn-finish']}`}
                onClick={handleFinishClick}
                style={{ marginLeft: '1rem' }}
              >
                Finish
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: PALETTE */}
        <div className={styles['palette-area']}>
          <div className={styles['palette-title']}>ANSWER STATUS</div>
          <div className={styles['palette-grid']}>
            {currentAttempt.questions.map((q, index) => (
              <button
                key={q.id}
                className={`${styles['palette-btn']} ${getPaletteClass(q.id)} ${currentQIndex === index ? styles['palette-current'] : ''}`}
                onClick={() => setCurrentQIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONFIRM SUBMIT DIALOG (replaces window.confirm) */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmNo}
        aria-labelledby="submit-confirm-title"
        aria-describedby="submit-confirm-desc"
        sx={{ '& .MuiDialog-paper': { width: '100%', borderRadius: '15px' } }}
        BackdropProps={{ sx: { backgroundColor: 'rgba(157, 152, 202, 0.5)' } }}
      >
        <DialogTitle id="submit-confirm-title" sx={{ fontSize: 20, color: '#0e387a', fontWeight: 600 }}>
          Submit Exam?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-confirm-desc" sx={{ fontSize: 16, color: '#555' }}>
            Are you sure you want to submit? You will not be able to change your answers
            after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={handleConfirmNo}
            sx={{
              borderRadius: '15px',
              color: '#fff',
              backgroundColor: '#388E3C',
              '&:hover': { backgroundColor: '#2f7533' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmYes}
            autoFocus
            sx={{
              borderRadius: '15px',
              color: '#fff',
              backgroundColor: '#F44336',
              '&:hover': { backgroundColor: '#bd3228' },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR for success/error feedback */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={alertType} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentExam;