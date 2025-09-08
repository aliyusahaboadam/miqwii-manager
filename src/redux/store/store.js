import { configureStore} from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import studentSlice from '../reducer/studentSlice';
import classSlice from '../reducer/classSlice';
import teacherSlice from '../reducer/teacherSlice';
import subjectSlice from '../reducer/subjectSlice';
import loginSlice from '../reducer/loginSlice';
import schoolSlice from '../reducer/schoolSlice';
import scoreSlice from '../reducer/scoreSlice';
import sessionSlice from '../reducer/sessionSlice';
import passwordSlice from '../reducer/passwordSlice';
import receiptSlice from '../reducer/receiptSlice';
import paymentSlice from '../reducer/paymentSlice';

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
     payments: paymentSlice
    },
  
    devTools: composeWithDevTools(),
   

});

export default store;