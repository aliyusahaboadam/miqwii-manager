
import {PDFDownloadLink, Document, Image, Page, pdf, View, StyleSheet, Font} from '@react-pdf/renderer';
import { ScoreTable } from './ScoreTable';
import { KeyTable } from './KeyTable';
import { Text } from '@react-pdf/renderer';
import roboto from './pdffonts/RobotoRegular-3m4L.ttf';
import Oswald from './pdffonts/Oswald-VariableFont_wght.ttf';
import { getResultByStudentRegNo } from '../../redux/reducer/scoreSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { result } from 'lodash';
import { useLocation } from 'react-router-dom';


// Create PDF document
const StudentResultByRegNo =  ({ requestData }) => {

    const dispatch = useDispatch();
    const scoreState = useSelector((state) => state.scores);
    const { results, fetchingStatus } = scoreState;
    const location = useLocation();


    useEffect(() => {
        
        fetchData();
  
      }, [requestData.regNo, location.pathname]);


      const fetchData = () => {
        if (fetchingStatus === 'idle') {
           const regNoData = {
            regNo: requestData.regNo,
            session: requestData.session,
            term: requestData.term
           }
           console.log("Confirming Data " + requestData.session);
          dispatch(getResultByStudentRegNo(regNoData))
        }
      }


      console.log(" result " + JSON.stringify(results));


    Font.register({
  family: 'Roboto',
  src: roboto,
});

Font.register({
  family: 'Oswald',
  src: Oswald,
});

// Sample data for testing
const ScoreColumns = [

  { 
    accessorKey: 'subjectName', 
    header: () => 'Subject', 
    size: 50
  },
  { 
    accessorKey: 'max', 
    header: () => 'Max', 
    size: 15,
   //meta: { type: 'float' } 
  },
  { 
    accessorKey: 'firstTest', 
    header: () => 'CA1', 
    size: 15,
    // meta: { type: 'float' } 
  },
  { 
    accessorKey: 'secondTest', 
    header: () => 'CA2', 
    size: 15,
    // meta: { type: 'float' } 
  },

    { 
    accessorKey: 'totalTest', 
    header: () => 'CA Total', 
    size: 20,
    // meta: { type: 'float' } 
  }
  ,
   { 
    accessorKey: 'exam', 
    header: () => 'Exam', 
    size: 15,
    // meta: { type: 'float' } 
  },

  { 
    accessorKey: 'totalExam', 
    header: () => 'Total', 
    size: 15,
    // meta: { type: 'float' } 
  },

  { 
    accessorKey: 'grade', 
    header: () => 'Grade', 
    size: 15,
   
  },

  { 
    accessorKey: 'remark', 
    header: () => 'Remark', 
    size: 30,
    
  }
];




const ScoreKeyColumns = [
  { 
    accessorKey: 'a', 
    // header: () => 'S/N', 
    size: 35, 
    bold: false
  },
  { 
    accessorKey: 'b', 
    // header: () => 'Subject', 
    size: 35
  }

  ,
  { 
    accessorKey: 'c', 
    // header: () => 'Subject', 
    size: 20 
  },

  ,
  { 
    accessorKey: 'd', 
    // header: () => 'Subject', 
    size: 20 
  }

  ,
  { 
    accessorKey: 'e', 
    // header: () => 'Subject', 
    size: 20
  }
];


// My Test Data for Score
// const sampleData = [
//   {  subject: {
//       name: 'john@example.com',
//       phone: '123-456-7890',
//       age: 30
//     }, max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//  {  subject: "Mathematic", max: 100, ca1: 18, ca2: 20,totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//  {  subject: "Tauheed", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//    {  subject: "Basic Science", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//  { subject: "Adab", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//  { subject: "English Language", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//    { subject: "Home Economic", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "B", remark: 'Pass' },
//  {  subject: "English Literature",max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "D", remark: 'Fail' },
//  {  subject: "IRK", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "E", remark: 'Good' },
//    {  subject: "English", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Very Good' },
//  {  subject: "English", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
//  {  subject: "English", max: 100, ca1: 18, ca2: 20, totalTest: 38, exam: 60, total: 80, grade: "A", remark: 'Excellence' },
// ];

const scoreKeyData = [
  { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' },
   { a: 'Excellence', b: 'Very Good', c: 'Good', d: 'Pass', e: 'Fail' }
];


    return (

<PDFDownloadLink 
  document={ 
  <Document>

    {
    
        results.map((result) => (

                <Page size="A4" style={resultStyle.body}>
                       <View  style={ resultStyle.logoAndHeadingContainer}>
         
                       <View style={ resultStyle.logo}>
                       <Image 
                       src={`https://images-0.s3.us-west-2.amazonaws.com/${result.school.logo}`} 
                       style={{
                       width: "100%",
                       height: "100%",
                       objectFit: "contain" 
                       }} 
                     />
                     </View>
                     <View style={ resultStyle.heading}>
         
                       <Text style={ resultStyle.schoolName}>{result.school.name}</Text>
                     <Text style={resultStyle.address}>{result.school.address}</Text>
                     <Text style={resultStyle.boldMottoText}> Motto:   <Text style={resultStyle.motto}>{result.school.motto}</Text> </Text>
                     <Text style={resultStyle.boldText}>School Reg: No.:  <Text style={resultStyle.address}> {result.school.regNo}</Text> Tel:   <Text style={resultStyle.address}>{result.school.contact}</Text> </Text>
                     
         
                     </View>
          
                       <View style={ resultStyle.logo}>
                       <Image 
                       src={`https://images-0.s3.us-west-2.amazonaws.com/${result.school.logo}`} 
                       style={{
                       width: "100%",
                       height: "100%",
                       objectFit: "contain" 
                       }} 
                     />
                     </View>
         
         
         </View>
         <Text style={resultStyle.secondHeader}> REPORT SHEET FOR {result.academicSession.term} TERM {result.academicSession.session} ACADEMIC SESSION </Text>
                  
                   <View style={resultStyle.detailsContainer}>
                      <View style={resultStyle.childContainer}>
                           <Text style={resultStyle.boldTextSecondary}>Name:  <Text style={resultStyle.detailsText}>{result.student.firstname + ' ' + result.student.surname + ' ' + result.student.lastname}</Text> </Text> 
                         <Text style={resultStyle.boldTextSecondary}>Reg No:   <Text style={resultStyle.detailsText}>{result.student.regNo}</Text>  </Text> 
                          <Text style={resultStyle.boldTextSecondary}>Class:   <Text style={resultStyle.detailsText}>{result.class1.name}</Text>  </Text>
                      </View>
                      <View style={resultStyle.childContainer}>
                         <Text style={resultStyle.boldTextSecondary}>Position:  <Text style={resultStyle.detailsText}>{result.position}</Text> </Text> 
                         <Text style={resultStyle.boldTextSecondary}>No In Class:   <Text style={resultStyle.detailsText}>{result.numberOfStudentInClass}</Text>  </Text> 
                          <Text style={resultStyle.boldTextSecondary}>Student Average:   <Text style={resultStyle.detailsText}>{result.overallAverage} </Text>  </Text>
                      </View>
                      <View style={resultStyle.childContainer}>
                         <Text style={resultStyle.boldTextSecondary}>Term:  <Text style={resultStyle.detailsText}>{result.academicSession.term}</Text> </Text> 
                         <Text style={resultStyle.boldTextSecondary}>Lowest Average in Class:   <Text style={resultStyle.detailsText}>{result.lowestAverage}</Text>  </Text> 
                          <Text style={resultStyle.boldTextSecondary}>Highest Average in Class:    <Text style={resultStyle.detailsText}>{result.highestAverage}</Text>  </Text>
                      </View>
                   </View>
         
                
             
               <ScoreTable columns={ScoreColumns} data={result.scores} />
               
               <View style={resultStyle.secondaryContainer}> 
               <Text style={resultStyle.subtitle}>
                 KEYS
               </Text>
                 <KeyTable columns={ScoreKeyColumns} data={scoreKeyData} />
               </View>
               <Text style={resultStyle.brandName}>~Generated By MiQwii Manager~</Text>
             </Page>

        ))
    }
    
  </Document>
  } 
  fileName="result.pdf"
>
  Download Result
</PDFDownloadLink>

       
    );
  
}

export default StudentResultByRegNo;










const resultStyle = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

   logoAndHeadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    
  },

  heading: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    width: 60,
    height: 60,
    // backgroundColor: "black"
    
  },
  
  schoolName: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald'
  },
  address: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'Roboto'
  },

   motto: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'Roboto'
  },

  detailsText: {
    fontSize: 10,
    textAlign: 'start',
    marginBottom: 2,
    fontFamily: 'Roboto'
  },
   
    boldText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Oswald',
    fontWeight: 'bold'
  },

   boldMottoText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'Oswald',
    fontWeight: 'bold'
  },

  boldTextSecondary: {
    fontSize: 10,
    textAlign: 'left',
   marginTop: 10,
    fontWeight: 'bold'
  },

   secondHeader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  brandName: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },

  secondaryContainer: {
   marginTop: 20,
   width: '50%'
  },
  
  detailsContainer: {
   flexDirection: "row",
   justifyContent: 'center',
   width: '100%',
   marginBottom: 10
  },

  childContainer: {
    width: 'auto',
    flexDirection: 'column',
    paddingLeft: 10
  }


});
