import { Checkbox } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { FieldArray, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  clearSelectedExam,
  createCbtExam,
  getTeacherExamById,
  getTemplateRules,
} from '../../redux/reducer/cbtSlice';
import { classExists, getClassNames } from '../../redux/reducer/classSlice';
import { getAllSubjectWithClassname } from '../../redux/reducer/subjectSlice';
import style from '../style/form/StudentRegistration.module.css';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, CssBaseline, IconButton, MenuItem, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Loading from '../Chunks/loading'; // ← NEW

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%',
  minHeight: '550px', maxHeight: '85vh', overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none', msOverflowStyle: 'none', borderRadius: '10px', padding: theme.spacing(4),
  gap: theme.spacing(2), margin: 'auto', [theme.breakpoints.up('sm')]: { maxWidth: '800px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative', minHeight: '100vh', width: '100%', backgroundColor: 'rgba(10, 40, 89)',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='251' height='251' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%230E387A' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230E387A'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");`,
  backgroundSize: 'cover', backgroundRepeat: 'no-repeat', padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': { content: '""', display: 'block', position: 'absolute', zIndex: -1, inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
  },
}));

// Reusable sx to bump all input text at once
const inputSizing = {
  '& .MuiInputBase-input': { fontSize: 18 },
  '& .MuiInputLabel-root': { fontSize: 16 },
  '& .MuiFormHelperText-root': { fontSize: 14 },
};

const createEmptyQuestion = () => ({
  questionText: '', questionType: 'SINGLE_CHOICE',
  options: [
    { optionLabel: 'A', optionText: '', isCorrect: true },
    { optionLabel: 'B', optionText: '', isCorrect: false },
    { optionLabel: 'C', optionText: '', isCorrect: false },
    { optionLabel: 'D', optionText: '', isCorrect: false },
  ]
});

const TeacherCreateExam = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { examId } = useParams();
  const isEdit = Boolean(examId);

  const [templateRules, setTemplateRules] = useState({});
  const [fetchingRules, setFetchingRules] = useState(false);

  const [initialValues, setInitialValues] = useState({
    id: null, name: "", assessmentSlot: "", durationMinutes: 60, className: "", subjectId: "",
    availableFrom: "", availableUntil: "", questions: [createEmptyQuestion()]
  });

  useEffect(() => {
    if (!examId) {
      dispatch(clearSelectedExam());
      return;
    }
    dispatch(getTeacherExamById(examId)).unwrap().then((exam) => {
      setInitialValues({
        id: exam.id, name: exam.name, assessmentSlot: exam.assessmentSlot,
        durationMinutes: exam.durationMinutes, className: exam.className, subjectId: exam.subjectId,
        availableFrom: exam.availableFrom || "", availableUntil: exam.availableUntil || "",
        questions: exam.questions?.length > 0 ? exam.questions.map((q) => ({
          questionText: q.questionText, questionType: q.questionType,
          options: q.options.map((o) => ({ optionLabel: o.optionLabel, optionText: o.optionText, isCorrect: Boolean(o.isCorrect) })),
        })) : [createEmptyQuestion()],
      });
    });
  }, [examId, dispatch]);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const classState = useSelector((state) => state.classes);
  const { classNames, fetchingStatus } = classState;   // ← ADD fetchingStatus
  const subjectState = useSelector((state) => state.subjects);
  const { subjectWithClassname } = subjectState;

  useEffect(() => { fetchData(); }, [location.pathname]);

  async function fetchData() {
    const result = await dispatch(classExists()).unwrap();
    if (result.message === true) {
      dispatch(getClassNames());
      dispatch(getAllSubjectWithClassname());
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const getQuestionCount = (slot) => {
    return templateRules[slot] || 0;
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const maxMarks = templateRules[values.assessmentSlot];
    if (values.questions.length > maxMarks) {
      setAlertType("error");
      setMessage(`You cannot exceed ${maxMarks} questions for ${values.assessmentSlot}.`);
      setOpen(true);
      return;
    }

    try {
      await dispatch(createCbtExam(values)).unwrap();
      setAlertType("success");
      setMessage(isEdit ? "CBT Exam Updated Successfully!" : "CBT Exam Created Successfully!");
      setOpen(true);
      setTimeout(() => navigate('/cbt/teacher/list'), 1500);
    } catch (error) {
      setAlertType("error");
      setMessage(error || "Error Creating Exam. Try Again!");
      setOpen(true);
    }
  };

  // ✅ LOADING GATE — same pattern as ViewSubjects
  if (fetchingStatus === 'loading') {
    return <Loading />;
  }

  return (
    <ClickAwayListener onClickAway={() => {}}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box component="main" sx={{ flexGrow: 1, fontSize: 20 }}>
          <SignInContainer>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleFormSubmit}>
              {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur, setFieldValue }) => {

                const filteredSubjects = subjectWithClassname.filter(subject => {
                  const match = subject.name.match(/\[(.+)\]$/);
                  return match && match[1] === values.className;
                });

                return (
                  <Card>
                    <section className={style.container__brand}><img src="/images/logo.png" alt="Logo"/></section>
                    <p className={style['form-header']}>{isEdit ? 'Edit CBT Exam' : 'Create CBT Exam'}</p>

                    {/* EXAM DETAILS — sx bumps input/label font sizes */}
                    <Paper sx={{ p: 3, mb: 3, width: '100%', background: '#f9f9f9', ...inputSizing }}>
                      <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr', gap: '1rem' }}>

                        <TextField label="Exam Name" name="name" onChange={handleChange} value={values.name} variant="filled" fullWidth required />

                        <TextField label="Duration (Minutes)" type="number" name="durationMinutes" onChange={handleChange} value={values.durationMinutes} variant="filled" fullWidth />

                        <TextField
                          select
                          label="Class"
                          name="className"
                          onChange={async (e) => {
                            const selectedClass = e.target.value;
                            setFieldValue("className", selectedClass);
                            setFieldValue("subjectId", "");
                            setFieldValue("assessmentSlot", "");
                            setTemplateRules({});

                            if (selectedClass) {
                              setFetchingRules(true);
                              try {
                                const rules = await dispatch(getTemplateRules(selectedClass)).unwrap();
                                setTemplateRules(rules);

                                const availableSlots = Object.keys(rules);
                                if (availableSlots.length > 0) {
                                  setFieldValue("assessmentSlot", availableSlots[0]);
                                }
                              } catch (err) {
                                console.error("Failed to fetch template rules", err);
                                alert("Could not load template rules for this class.");
                              } finally {
                                setFetchingRules(false);
                              }
                            }
                          }}
                          value={values.className}
                          variant="filled"
                          fullWidth
                          required
                        >
                          {classNames && classNames.map(c => (
                            <MenuItem key={c} value={c} sx={{ fontSize: 16 }}>{c}</MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          select
                          label="Assessment Slot"
                          name="assessmentSlot"
                          onChange={(e) => {
                            setFieldValue("assessmentSlot", e.target.value);
                            setFieldValue("questions", [createEmptyQuestion()]);
                          }}
                          value={values.assessmentSlot}
                          variant="filled"
                          fullWidth
                          required
                          disabled={fetchingRules || Object.keys(templateRules).length === 0}
                          helperText={fetchingRules ? "Loading rules..." : ""}
                        >
                          {Object.keys(templateRules).map(slot => (
                            <MenuItem key={slot} value={slot} sx={{ fontSize: 16 }}>
                              {slot} (Max {templateRules[slot]} Questions)
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          select
                          label="Subject"
                          name="subjectId"
                          onChange={handleChange}
                          value={values.subjectId}
                          variant="filled"
                          fullWidth
                          required
                          disabled={!values.className || filteredSubjects.length === 0}
                        >
                          {filteredSubjects.map((subj) => (
                            <MenuItem key={subj.id} value={subj.id} sx={{ fontSize: 16 }}>{subj.name}</MenuItem>
                          ))}
                        </TextField>

                        <TextField label="Available From" type="datetime-local" name="availableFrom" onChange={handleChange} value={values.availableFrom} variant="filled" InputLabelProps={{ shrink: true }} fullWidth />
                        <TextField label="Available Until" type="datetime-local" name="availableUntil" onChange={handleChange} value={values.availableUntil} variant="filled" InputLabelProps={{ shrink: true }} fullWidth />
                      </div>
                    </Paper>

                    <FieldArray name="questions">
                      {({ push, remove }) => (
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <Typography variant="h6" sx={{ color: '#0e387a' }}>Questions ({values.questions.length})</Typography>

                            <Button
                              variant="contained"
                              color="secondary"
                              disabled={!values.assessmentSlot}
                              onClick={() => {
                                const count = getQuestionCount(values.assessmentSlot);
                                const newQuestions = [];
                                for (let i = 0; i < count; i++) newQuestions.push(createEmptyQuestion());
                                setFieldValue('questions', newQuestions);
                              }}
                            >
                              ⚡ Auto-Generate {getQuestionCount(values.assessmentSlot)} Questions
                            </Button>
                          </div>

                          {values.questions.map((q, qIndex) => (
                            <Paper
                              key={qIndex}
                              sx={{ p: 3, mb: 2, borderLeft: '4px solid #0e387a', ...inputSizing }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Question {qIndex + 1}</Typography>
                                {values.questions.length > 1 && (
                                  <IconButton onClick={() => remove(qIndex)} color="error"><DeleteIcon /></IconButton>
                                )}
                              </div>

                              <TextField label="Question Text" name={`questions.${qIndex}.questionText`} onChange={handleChange} value={q.questionText} fullWidth multiline rows={2} sx={{ mb: 2 }} variant="filled" />

                              <Typography variant="caption" color="textSecondary" sx={{ fontSize: 14 }}>Select the correct answer:</Typography>
                              <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr', gap: '1rem', mt: 1 }}>
                                {q.options.map((opt, oIndex) => (
                                  <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Checkbox
                                      checked={opt.isCorrect}
                                      onChange={() => {
                                        q.options.forEach((_, i) => setFieldValue(`questions.${qIndex}.options.${i}.isCorrect`, false));
                                        setFieldValue(`questions.${qIndex}.options.${oIndex}.isCorrect`, true);
                                      }}
                                    />
                                    <TextField label={`Option ${opt.optionLabel}`} name={`questions.${qIndex}.options.${oIndex}.optionText`} onChange={handleChange} value={opt.optionText} size="medium" fullWidth variant="outlined" />
                                  </div>
                                ))}
                              </div>
                            </Paper>
                          ))}

                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              if (values.questions.length >= getQuestionCount(values.assessmentSlot)) {
                                alert("You cannot add more questions than the maximum marks for this assessment.");
                                return;
                              }
                              push(createEmptyQuestion());
                            }}
                            sx={{ mb: 3 }}
                          >
                            Add Single Question
                          </Button>
                        </div>
                      )}
                    </FieldArray>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      onClick={handleSubmit}
                      className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                    >
                      {isSubmitting ? 'Saving Exam...' : (isEdit ? 'Update Exam' : 'Save & Publish Exam')}
                    </button>
                  </Card>
                );
              }}
            </Formik>

            <div className={style.footer__brand}>
              <img src="/images/logo.png" alt="" />
              <p className={style.footer__copyright}>(c) 2026 Miqwii, All Rights Reserved</p>
            </div>
          </SignInContainer>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default TeacherCreateExam;