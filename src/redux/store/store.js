// File: src/redux/store.js
import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';
import classSlice from '../reducer/classSlice';
import graduationSlice from '../reducer/graduationSlice';
import loginSlice from '../reducer/loginSlice';
import passwordSlice from '../reducer/passwordSlice';
import paymentSlice from '../reducer/paymentSlice';
import promotionSlice from '../reducer/promotionSlice';
import receiptSlice from '../reducer/receiptSlice';
import schoolSlice from '../reducer/schoolSlice';
import scoreSlice from '../reducer/scoreSlice';
import sessionSlice from '../reducer/sessionSlice';
import settingsSlice from '../reducer/settingsSlice';
import studentSlice from '../reducer/studentSlice';
import subjectSlice from '../reducer/subjectSlice';
import teacherSlice from '../reducer/teacherSlice';

const store = configureStore({
    reducer: {
        students: studentSlice,
        classes: classSlice,
        teachers: teacherSlice,
        subjects: subjectSlice,
        login: loginSlice,
        schools: schoolSlice,
        scores: scoreSlice,
        sessions: sessionSlice,
        passwords: passwordSlice,
        receipts: receiptSlice,
        payments: paymentSlice,
        settings: settingsSlice,
        promotion: promotionSlice,
        graduation: graduationSlice,
    },

    devTools: composeWithDevTools(),

});

export default store;