// File: src/App.js
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
import Sessions from './component/admin/Sessions';
import UpdateDomainName from './component/admin/UpdateDomainName';
import UpdateSchool from './component/admin/UpdateSchool';
import UpdateSessionAdmin from './component/admin/UpdateSessionAdmin';
import AddClass from './component/class/AddClass';
import AddCustomClass from './component/class/AddCustomClass';
import CrecheClasses from './component/class/CrecheClasses';
import KGClasses from './component/class/KGClasses';
import NurseryClasses from './component/class/NurseryClasses';
import PrimaryClasses from './component/class/PrimaryClasses';
import SecondaryClasses from './component/class/SecondaryClasses';
import UpdateClass from './component/class/UpdateClass';
import AdminDashboard from './component/dashboards/AdminDashboard';
import SchoolDashboard from './component/dashboards/SchoolDashboard';
import StudentDashboard from './component/dashboards/StudentDashboard';
import TeacherDashboard from './component/dashboards/TeacherDashboard';
import AboutUs from './component/home/AboutUs';
import ContactUs from './component/home/ContactUs';
import Home from './component/home/Home';
import Services from './component/home/Services';
import IDCardSetup from './component/idcard/IDCardSetup';
import StudentReceipt from './component/receipt/StudentReceipt';
import ViewStudentReceipt from './component/receipt/ViewStudentReceipt';
import ShowMasterSheet from './component/result/ShowMasterSheet';
import ShowResultByRegNo from './component/result/ShowResultByRegNo';
import ShowResults from './component/result/ShowResults';
import StudentResultByRegNoStudentDashboard from './component/result/StudentResultByRegNoStudentDashboard';
import StudentResultByRegNoTeacherDashboard from './component/result/StudentResultByRegNoTeacherDashboard';
import CustomizedSchoolLogin from './component/school/CustomizedSchoolLogin';
import PasswordRequest from './component/school/PasswordRequest';
import ResetPassword from './component/school/ResetPassword';
import SchoolLogin from './component/school/SchoolLogin';
import SchoolProfile from './component/school/SchoolProfile';
import SchoolRegistration from './component/school/SchoolRegistration';
import StudentActivator from './component/school/StudentActivator';
import UploadSchoolLogo from './component/school/UploadSchoolLogo';
import VerifierPage from './component/school/VerifierPage';
import AddExam from './component/score/AddExam';
import AddFirstCA from './component/score/AddFirstCA';
import AddScore from './component/score/AddScore';
import AddSecondCA from './component/score/AddSecondCA';
import AddStudent from './component/student/AddStudent';
import StudentDetails from './component/student/StudentDetails';
import StudentProfile from './component/student/StudentProfile';
import StudentResetPassword from './component/student/StudentResetPassword';
import Students from './component/student/Students';
import UpdateStudent from './component/student/UpdateStudent';
import ViewStudents from './component/student/ViewStudents';
import AddSubjects from './component/subject/AddSubjects';
import CustomAddSubject from './component/subject/CustomAddSubject';
import Subjects from './component/subject/Subjects';
import UpdateSubject from './component/subject/UpdateSubject';
import ViewSubjects from './component/subject/ViewSubjects';
import PayUs from './component/subscription/PayUs';
import Payments from './component/subscription/Payments';
import AddTeacher from './component/teacher/AddTeacher';
import TeacherDetails from './component/teacher/TeacherDetails';
import TeacherProfile from './component/teacher/TeacherProfile';
import TeacherResetPassword from './component/teacher/TeacherResetPassword';
import TeacherSubject from './component/teacher/TeacherSubject';
import Teachers from './component/teacher/Teachers';
import UpdateTeacher from './component/teacher/UpdateTeacher';
import { useSubdomain } from './component/utility/useSubdomain';
// Promotion & Graduation screens
import GraduateClass from './component/graduation/GraduateClass';
import GraduatedStudents from './component/graduation/GraduatedStudents';
import GraduationHistory from './component/graduation/GraduationHistory';
import SelectiveGraduation from './component/graduation/SelectiveGraduation';
import PromotionHistory from './component/promotion/PromotionHistory';
import PromotionPreview from './component/promotion/PromotionPreview';
import PromotionSetup from './component/promotion/PromotionSetup';
import SelectivePromotion from './component/promotion/SelectivePromotion';


function App() {

  const subdomain = useSubdomain();

  // If subdomain exists, show school page — ignore all other routes
  if (subdomain) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<CustomizedSchoolLogin subdomain={subdomain} />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;

const AppRoutes = () => (
  <Routes>

    {/* ---------- Student ---------- */}
    <Route exact path='/student/add-student' element={<AddStudent />} />
    <Route exact path='/student/view-students' element={<ViewStudents />} />
    <Route exact path='/student/students/:className' element={<Students />} />
    <Route exact path='/student/update-student/:id/:className' element={<UpdateStudent />} />
    <Route exact path='/student/student-details/:id' element={<StudentDetails />} />
    <Route exact path='/student/student-profile' element={<StudentProfile />} />

    {/* ---------- ID Cards ---------- */}
    <Route exact path='/student/id-card' element={<IDCardSetup />} />

    {/* ---------- Teacher ---------- */}
    <Route exact path='/teacher/add-teacher' element={<AddTeacher />} />
    <Route exact path='/teacher/teacher-profile' element={<TeacherProfile />} />
    <Route exact path='/teacher/view-teachers' element={<Teachers />} />
    <Route exact path='/teacher/update-teacher/:id' element={<UpdateTeacher />} />
    <Route exact path='/teacher/teacher-details/:id' element={<TeacherDetails />} />
    <Route exact path='/teacher/teacher-subjects/:classId/:className' element={<TeacherSubject />} />

    {/* ---------- Class views (one per section) ---------- */}
    <Route exact path='/class/creche-classes' element={<CrecheClasses />} />
    <Route exact path='/class/kg-classes' element={<KGClasses />} />
    <Route exact path='/class/nursery-classes' element={<NurseryClasses />} />
    <Route exact path='/class/primary-classes' element={<PrimaryClasses />} />
    <Route exact path='/class/secondary-classes' element={<SecondaryClasses />} />

    {/* ---------- Class add/edit ---------- */}
    <Route exact path='/class/add-class' element={<AddClass />} />
     <Route exact path='/class/add-custom-class' element={<AddCustomClass />} />
    <Route exact path='/class/update-class/:className' element={<UpdateClass />} />

    {/* ---------- Subject ---------- */}
    <Route exact path='/subject/add-subjects' element={<AddSubjects />} />
    <Route exact path='/subject/add-custom-subject' element={<CustomAddSubject />} />
    <Route exact path='/subject/view-subjects' element={<ViewSubjects />} />
    <Route exact path='/subject/subjects/:className' element={<Subjects />} />
    <Route exact path='/subject/update-subject/:id/:className' element={<UpdateSubject />} />

    {/* ---------- Score ---------- */}
    <Route exact path='/score/add-score/:subjectId/:classId/:className/:subjectName' element={<AddScore />} />
    <Route exact path='/score/add-first-ca/:subjectId/:classId/:className/:subjectName' element={<AddFirstCA />} />
    <Route exact path='/score/add-second-ca/:subjectId/:classId/:className/:subjectName' element={<AddSecondCA />} />
    <Route exact path='/score/add-exam/:subjectId/:classId/:className/:subjectName' element={<AddExam />} />

    {/* ---------- Session ---------- */}
    <Route exact path='/session/add-session' element={<AddSession />} />
    <Route exact path='/session/setup-session' element={<SessionSetup />} />
    <Route exact path='/session/update-session' element={<AddNextTermFeeAndResumptionDate />} />

    {/* ---------- Promotion ---------- */}
    <Route exact path='/promotion/setup' element={<PromotionSetup />} />
    <Route exact path='/promotion/preview' element={<PromotionPreview />} />
    <Route exact path='/promotion/history' element={<PromotionHistory />} />
    <Route exact path='/promotion/selective' element={<SelectivePromotion />} />


    {/* ---------- Graduation ---------- */}
    <Route exact path='/graduation/graduate-class' element={<GraduateClass />} />
    <Route exact path='/graduation/graduated-students' element={<GraduatedStudents />} />
    <Route exact path='/graduation/history' element={<GraduationHistory />} />
    <Route exact path='/graduation/selective' element={<SelectiveGraduation />} />

    {/* ---------- Receipt ---------- */}
    <Route exact path='/receipt/view-student-reciept' element={<ViewStudentReceipt />} />
    <Route exact path='/receipt/student-reciept/:className' element={<StudentReceipt />} />

    {/* ---------- Payment ---------- */}
    <Route exact path='/payment/pay-subscription' element={<PayUs />} />
    <Route exact path='/payment/all-payments' element={<Payments />} />

    {/* ---------- Settings ---------- */}
    <Route exact path='/settings/settings' element={<Settings />} />

    {/* ---------- Password ---------- */}
    <Route exact path='/password/password-request' element={<PasswordRequest />} />
    <Route exact path='/password/password-reset' element={<ResetPassword />} />
    <Route exact path='/password/password-reset-student' element={<StudentResetPassword />} />
    <Route exact path='/password/password-reset-teacher' element={<TeacherResetPassword />} />

    {/* ---------- Result ---------- */}
    <Route exact path='/result/show-results' element={<ShowResults />} />
    <Route exact path='/result/show-mastersheet' element={<ShowMasterSheet />} />
    <Route exact path='/result/student-result-by-regNo' element={<ShowResultByRegNo />} />
    <Route exact path='/result/student-result-by-regNo' element={<StudentResultByRegNoStudentDashboard />} />
    <Route exact path='/result/teacher-search-by-regNo' element={<StudentResultByRegNoTeacherDashboard />} />

    {/* ---------- School ---------- */}
    <Route exact path='/school/student-activator' element={<StudentActivator />} />
    <Route exact path='/admin/school-activator/:id' element={<SchoolActivator />} />
    <Route exact path='/admin/update-school/:id' element={<UpdateSchool />} />
    <Route exact path='/admin/update-domain-name/:id' element={<UpdateDomainName />} />
    <Route exact path='/admin/school-profile/:id' element={<AdminSchoolsDetails />} />
    <Route exact path='/school/school-profile' element={<SchoolProfile />} />
    <Route exact path='/school/upload-school-logo' element={<UploadSchoolLogo />} />

    {/* ---------- Admin ---------- */}
    <Route exact path='/admin/schools' element={<SchoolsAdmin />} />
    <Route exact path='/admin/all-session' element={<Sessions />} />
    <Route exact path='/admin/profile' element={<AdminProfile />} />
    <Route exact path='/admin/update-session/:id' element={<UpdateSessionAdmin />} />

    {/* ---------- Dashboards ---------- */}
    <Route exact path='/school/home' element={<SchoolDashboard />} />
    <Route exact path='/admin/home' element={<AdminDashboard />} />
    <Route exact path='/teacher/home' element={<TeacherDashboard />} />
    <Route exact path='/student/home' element={<StudentDashboard />} />

    {/* ---------- Auth ---------- */}
    <Route exact path='/school/register' element={<SchoolRegistration />} />
    <Route exact path='/school/login' element={<SchoolLogin />} />
    <Route exact path='/school/login-customized' element={<CustomizedSchoolLogin />} />
    <Route exact path='/school/verify-account' element={<VerifierPage />} />

    {/* ---------- Website ---------- */}
    <Route exact path='/services' element={<Services />} />
    <Route exact path='/contact-us' element={<ContactUs />} />
    <Route exact path='/about-us' element={<AboutUs />} />
  </Routes>
);