import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Settings from './component/Settings/Settings';
import AddNextTermFeeAndResumptionDate from './component/academicSession/AddNextFeeAndResumptionDate';
import AddSession from './component/academicSession/AddSession';
import SessionSetup from './component/academicSession/SessionSetup';
import AdminProfile from './component/admin/AdminProfile';
import AdminSchoolsDetails from './component/admin/AdminSchoolsDetails';
import SchoolActivator from './component/admin/SchoolActivator';
import SchoolsAdmin from './component/admin/SchoolsAdmin';
import UpdateSchool from './component/admin/UpdateSchool';
import AddJSSClass from './component/class/AddJSSClass';
import AddNurClass from './component/class/AddNurClass';
import AddPreNurClass from './component/class/AddPreNurClass';
import AddPriClass from './component/class/AddPriClass';
import AddSSSClass from './component/class/AddSSSClass';
import DeleteClass from './component/class/DeleteClass';
import JSSClasses from './component/class/JSSClasses';
import NurseryClasses from './component/class/NurseryClasses';
import PreNurseryClasses from './component/class/PreNurseryClasses';
import PrimaryClasses from './component/class/PrimaryClasses';
import SSSClasses from './component/class/SSSClasses';
import UpdateClass from './component/class/UpdateClass';
import AdminDashboard from './component/dashboards/AdminDashboard';
import SchoolDashboard from './component/dashboards/SchoolDashboard';
import StudentDashboard from './component/dashboards/StudentDashboard';
import TeacherDashboard from './component/dashboards/TeacherDashboard';
import AboutUs from './component/home/AboutUs';
import ContactUs from './component/home/ContactUs';
import Home from './component/home/Home.jsx';
import Services from './component/home/Services';
import StudentReceipt from './component/receipt/StudentReceipt';
import ViewStudentReceipt from './component/receipt/ViewStudentReceipt';
import ShowMasterSheet from './component/result/ShowMasterSheet';
import ShowResultByRegNo from './component/result/ShowResultByRegNo';
import ShowResults from './component/result/ShowResults';
import StudentResultByRegNoStudentDashboard from './component/result/StudentResultByRegNoStudentDashboard';
import StudentResultByRegNoTeacherDashboard from './component/result/StudentResultByRegNoTeacherDashboard';
import PasswordRequest from './component/school/PasswordRequest';
import ResetPassword from './component/school/ResetPassword';
import SchoolLogin from './component/school/SchoolLogin';
import SchoolProfile from './component/school/SchoolProfile';
import SchoolRegistration from './component/school/SchoolRegistration';
import StudentActivator from './component/school/StudentActivator';
import UploadSchoolLogo from './component/school/UploadSchoolLogo';
import VerifierPage from './component/school/VerifierPage';
import AddScore from './component/score/AddScore';
import AddStudent from './component/student/AddStudent';
import StudentDetails from './component/student/StudentDetails';
import StudentProfile from './component/student/StudentProfile';
import StudentResetPassword from './component/student/StudentResetPassword';
import Students from './component/student/Students';
import UpdateStudent from './component/student/UpdateStudent';
import ViewStudents from './component/student/ViewStudents';
import AddSubjects from './component/subject/AddSubjects';
import Subjects from './component/subject/Subjects';
import UpdateSubject from './component/subject/UpdateSubject';
import ViewSubjects from './component/subject/ViewSubjects';
import PayUS from './component/subscription/PayUs';
import PayUSOutside from './component/subscription/PayUsOutside';
import Payments from './component/subscription/Payments';
import AddTeacher from './component/teacher/AddTeacher';
import TeacherDetails from './component/teacher/TeacherDetails';
import TeacherProfile from './component/teacher/TeacherProfile';
import TeacherResetPassword from './component/teacher/TeacherResetPassword';
import TeacherSubject from './component/teacher/TeacherSubject';
import Teachers from './component/teacher/Teachers';
import UpdateTeacher from './component/teacher/UpdateTeacher';



function App() {


  
  return (
    <Router>
    <Routes>
        {/* <Route exact path='/'  element={<Testing/>}/> */}
   

           {/*Student Releted*/}
        <Route exact path='/student/add-student'  element={ <AddStudent/> }/>
        <Route exact path='/student/view-students'  element={ <ViewStudents/> }/>
        <Route exact path='/student/students/:className'  element={ <Students/> }/>
        <Route exact path='/student/update-student/:id/:className'  element={ <UpdateStudent/> }/>
        <Route exact path='/student/student-details/:id'  element={ <StudentDetails/> }/>
         <Route exact path='/student/student-profile'  element={ <StudentProfile/> }/>
           {/*Teacher Releted*/}
        <Route exact path='/teacher/add-teacher'  element={ <AddTeacher/> }/>
        <Route exact path='/teacher/teacher-profile'  element={ <TeacherProfile/> }/>
        <Route exact path='/teacher/view-teachers'  element={ <Teachers/> }/>
        <Route exact path='/teacher/update-teacher/:id'  element={ <UpdateTeacher/> }/>
        <Route exact path='/teacher/teacher-details/:id'  element={ <TeacherDetails/> }/>
        <Route exact path='/teacher/teacher-subjects/:classId/:className'  element={ <TeacherSubject/> }/>
           {/*Class Releted*/}
         <Route exact path='/class/jss-classes'  element={ <JSSClasses/> }/>
         <Route exact path='/class/sss-classes'  element={ <SSSClasses/> }/>
         <Route exact path='/class/primary-classes'  element={ <PrimaryClasses/> }/>
         <Route exact path='/class/nursery-classes'  element={ <NurseryClasses/> }/>
          <Route exact path='/class/pre-nursery-classes'  element={ <PreNurseryClasses/> }/>
         

        <Route exact path='/class/add-jss-class'  element={ <AddJSSClass/> }/>
        <Route exact path='/class/add-sss-class'  element={ <AddSSSClass/> }/>
        <Route exact path='/class/add-pri-class'  element={ <AddPriClass/> }/>
        <Route exact path='/class/add-nur-class'  element={ <AddNurClass/> }/>
        <Route exact path='/class/add-pre-nur-class'  element={ <AddPreNurClass/> }/>
        <Route exact path='/class/delete-class'  element={ <DeleteClass/> }/>
        <Route exact path='/class/update-class/:className'  element={ <UpdateClass/> }/>
              {/*Subject Releted*/}
        <Route exact path='/subject/add-subjects'  element={ <AddSubjects/> }/>
        <Route exact path='/subject/view-subjects'  element={ <ViewSubjects/> }/>
        <Route exact path='/subject/subjects/:className'  element={ <Subjects/> }/>
        <Route exact path='/subject/update-subject/:id/:className'  element={ <UpdateSubject/> }/>

           {/*Score Releted*/}
        <Route exact path='/score/add-score/:subjectId/:classId/:className/:subjectName'  element={ <AddScore/> }/>

         {/*Session Releted*/}
         <Route exact path='/session/add-session'  element={ <AddSession/> }/>
         <Route exact path='/session/setup-session'  element={ <SessionSetup/> }/>
         <Route exact path='/session/update-session'  element={ <AddNextTermFeeAndResumptionDate/> }/>
             {/*Receipt Releted*/}
        <Route exact path='/receipt/view-student-reciept'  element={ <ViewStudentReceipt/> }/>
         <Route exact path='/receipt/student-reciept/:className'  element={ <StudentReceipt/> }/>
        
          
              {/*Payment Releted*/}
        <Route exact path='/payment/pay-expired-subscription/:id'  element={<PayUSOutside/>}/>
        <Route exact path='/payment/pay-subscription'  element={ <PayUS/> }/>
        <Route exact path='/payment/all-payments'  element={ <Payments/> }/>


           {/*Settings Releted*/}
        <Route exact path='/settings/settings'  element={ <Settings/> }/>

          {/*Password Releted*/}
        <Route exact path='/password/password-request'  element={<PasswordRequest/>}/>
         <Route exact path='/password/password-reset'  element={<ResetPassword/>}/>
         <Route exact path='/password/password-reset-student'  element={<StudentResetPassword/>}/>
         <Route exact path='/password/password-reset-teacher'  element={<TeacherResetPassword/>}/>
         {/*Result Releted*/}
         <Route exact path='/result/show-results'  element={ <ShowResults/> }/>
          <Route exact path='/result/show-mastersheet'  element={ <ShowMasterSheet/> }/>
          <Route exact path='/result/student-result-by-regNo'  element={ <ShowResultByRegNo/> }/>
          <Route exact path='/result/student-search-by-regNo'  element={ <StudentResultByRegNoStudentDashboard/> }/>
          <Route exact path='/result/teacher-search-by-regNo'  element={ <StudentResultByRegNoTeacherDashboard/> }/> 
           {/*school Releted*/}
             <Route exact path='/school/student-activator' element={ <StudentActivator/> }/>
            <Route exact path='/admin/school-activator/:id' element={ <SchoolActivator/> }/>
            <Route exact path='/admin/update-school/:id' element={ <UpdateSchool/> }/>
             <Route exact path='/admin/school-profile/:id' element={ <AdminSchoolsDetails/> }/>
            <Route exact path='/school/school-profile' element={ <SchoolProfile/> }/>
            <Route exact path='/school/upload-school-logo' element={ <UploadSchoolLogo/> }/>
          {/*Admin Releted*/}
          <Route exact path='/admin/schools' element={ <SchoolsAdmin/> }/>
            <Route exact path='/admin/profile' element={ <AdminProfile/> }/>
           {/*Dashboard Releted*/}
        <Route exact path='/school/home' element={ <SchoolDashboard/> }/>
        <Route exact path='/admin/home' element={ <AdminDashboard/> }/>
        <Route exact path='/teacher/home' element={ <TeacherDashboard/> }/>
        <Route exact path='/student/home' element={ <StudentDashboard/> }/>
            {/*Registration and Login*/}
        <Route exact path='/school/register'  element={<SchoolRegistration/>}/>
        <Route exact path='/school/login'  element={<SchoolLogin/>}/>
        <Route exact path='/school/verify-account'  element={ <VerifierPage/> }/>
           {/*Website*/}
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/services' element={<Services/>}/>
        <Route exact path='/contact-us' element={<ContactUs/>}/>
        <Route exact path='/about-us' element={<AboutUs/>}/>
    </Routes>
</Router>
  );
}

export default App;
