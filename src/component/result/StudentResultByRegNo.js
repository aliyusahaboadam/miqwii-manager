import {Document, Image, Page, pdf, View, StyleSheet, Font} from '@react-pdf/renderer';
import { ScoreTable } from './ScoreTable';
import { KeyTable } from './KeyTable';
import { Text } from '@react-pdf/renderer';
import roboto from './pdffonts/RobotoRegular-3m4L.ttf';
import Oswald from './pdffonts/Oswald-VariableFont_wght.ttf';
import { getResultByStudentRegNo } from '../../redux/reducer/scoreSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const StudentResultByRegNo = ({ requestData }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector((state) => state.scores);
  const { results, fetchingStatus } = scoreState;
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);

  const formatAmount = (amount) => {
    return `N${new Intl.NumberFormat('en-NG').format(amount)}`;
  };


  // Function to get remark based on position
// Function to get remark based on position and class size
const getPositionRemark = (position, totalStudents) => {
  // Calculate percentile (what percentage of class is below this student)
  const percentile = ((totalStudents - position) / totalStudents) * 100;
  
  // Handle edge cases
  if (totalStudents === 1) {
    return "Only student in class. Keep it up!"; // 38 chars
  }
  
  // Top 5% - Outstanding
  if (percentile >= 95) {
    return "Outstanding! Keep up the excellent effort."; // 43 chars
  }
  
  // Top 10% - Excellent
  if (percentile >= 90) {
    return "Excellent! You're among the very best."; // 39 chars
  }
  
  // Top 20% - Very Good
  if (percentile >= 80) {
    return "Very good performance. Keep it up!"; // 35 chars
  }
  
  // Top 40% - Good
  if (percentile >= 60) {
    return "Good effort. You can do better. Aim higher!"; // 44 chars
  }
  
  // Top 60% - Fair
  if (percentile >= 40) {
    return "Fair performance. More effort is needed."; // 41 chars
  }
  
  // Top 80% - Below Average
  if (percentile >= 20) {
    return "Put in more effort. Seek help when needed."; // 43 chars
  }
  
  // Bottom 20% - Needs Improvement
  return "Much improvement needed. Work harder!"; // 37 chars
};

  useEffect(() => {
    fetchData();
  }, [requestData.regNo, location.pathname]);

  const fetchData = () => {
   
      const regNoData = {
        regNo: requestData.regNo,
        session: requestData.session,
        term: requestData.term
      };
      console.log("Confirming Data " + requestData.session);
      dispatch(getResultByStudentRegNo(regNoData));
    
  };

  console.log(" result " + JSON.stringify(results));

  Font.register({
    family: 'Roboto',
    src: roboto,
  });

  Font.register({
    family: 'Oswald',
    src: Oswald,
  });

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
    },
    { 
      accessorKey: 'firstTest', 
      header: () => 'CA1', 
      size: 15,
    },
    { 
      accessorKey: 'secondTest', 
      header: () => 'CA2', 
      size: 15,
    },
    { 
      accessorKey: 'totalTest', 
      header: () => 'Sum', 
      size: 16,
    },
    { 
      accessorKey: 'exam', 
      header: () => 'Exam', 
      size: 15,
    },
    { 
      accessorKey: 'totalExam', 
      header: () => 'Total', 
      size: 15,
    },
    { 
      accessorKey: 'positionPerSubjectFormatted', 
      header: () => 'Pos', 
      size: 16,
    },
    { 
      accessorKey: 'grade', 
      header: () => 'Grade', 
      size: 16,
    },
    { 
      accessorKey: 'remark', 
      header: () => 'Remark', 
      size: 30,
    }
  ];

  const ScoreKeyColumns = [
    { accessorKey: 'a', size: 35, bold: false },
    { accessorKey: 'b', size: 35 },
    { accessorKey: 'c', size: 20 },
    { accessorKey: 'd', size: 20 },
    { accessorKey: 'e', size: 20 }
  ];

  const feesKeyColumns = [
    { 
      accessorKey: 'nextSSSTermFee', 
      header: () => 'SSS Class', 
      size: 35, 
      bold: false
    },
    { 
      accessorKey: 'nextJSSTermFee', 
      header: () => 'JSS Class', 
      size: 35
    },
    { 
      accessorKey: 'nextPRITermFee', 
      header: () => 'PRI Class', 
      size: 35 
    },

    
     { 
      accessorKey: 'nextNURTermFee', 
      header: () => 'NUR Class', 
      size: 35 
    },
  ];

  const feeKeyData = [
     {
        nextSSSTermFee: formatAmount(results?.[0]?.academicSession?.nextSSSTermFee || "Unset"),
        nextJSSTermFee: formatAmount(results?.[0]?.academicSession?.nextJSSTermFee || "Unset"),
        nextPRITermFee: formatAmount(results?.[0]?.academicSession?.nextPRITermFee || "Unset"),
        nextNURTermFee: formatAmount(results?.[0]?.academicSession?.nextNURTermFee || "Unset")
      }
  ];

  const scoreKeyData = [
    { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' },
    { a: 'Excellence', b: 'Very Good', c: 'Good', d: 'Pass', e: 'Fail' }
  ];

  // PDF Document Component
  const MyDocument = () => (
    <Document>
      {[results].map((result, index) => (

        
      

        <Page key={index} size="A4" style={resultStyle.body}>
          <View style={resultStyle.logoAndHeadingContainer}>
            <View style={resultStyle.logo}>
              <Image 
                src={`https://images-0.s3.us-west-2.amazonaws.com/${result.school.logo}`} 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain" 
                }} 
              />
            </View>
            <View style={resultStyle.heading}>
              <Text style={resultStyle.schoolName}>{result.school.name}</Text>
              <Text style={resultStyle.address}>{result.school.address}</Text>
              <Text style={resultStyle.boldMottoText}>
                Motto: <Text style={resultStyle.motto}>{result.school.motto}</Text>
              </Text>
              <Text style={resultStyle.boldText}>
                School Reg: No.: <Text style={resultStyle.address}>{result.school.regNo}</Text> Tel: <Text style={resultStyle.address}>{result.school.contact}</Text>
              </Text>
            </View>
            <View style={resultStyle.logo}>
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
          
          <Text style={resultStyle.secondHeader}>
            REPORT SHEET FOR {result.academicSession.term} TERM {result.academicSession.session} ACADEMIC SESSION
          </Text>
          
          <View style={resultStyle.detailsContainer}>
            <View style={resultStyle.childContainer}>
              <Text style={resultStyle.boldTextSecondary}>
                Name: <Text style={resultStyle.detailsText}>{result.student.firstname + ' ' + result.student.surname + ' ' + result.student.lastname}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                Reg No: <Text style={resultStyle.detailsText}>{result.student.regNo}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                Class: <Text style={resultStyle.detailsText}>{result.class1.name}</Text>
              </Text>
            </View>
            <View style={resultStyle.childContainer}>
              <Text style={resultStyle.boldTextSecondary}>
                Position: <Text style={resultStyle.detailsText}>{result.position}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                No In Class: <Text style={resultStyle.detailsText}>{result.numberOfStudentInClass}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                Student Average: <Text style={resultStyle.detailsText}>{result.overallAverage}</Text>
              </Text>
            </View>
            <View style={resultStyle.childContainer}>
              <Text style={resultStyle.boldTextSecondary}>
                Term: <Text style={resultStyle.detailsText}>{result.academicSession.term}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                Lowest Average in Class: <Text style={resultStyle.detailsText}>{result.lowestAverage}</Text>
              </Text> 
              <Text style={resultStyle.boldTextSecondary}>
                Highest Average in Class: <Text style={resultStyle.detailsText}>{result.highestAverage}</Text>
              </Text>
            </View>
          </View>

          <ScoreTable columns={ScoreColumns} data={result.scores} />
          
             {/* Bottom Section with Keys and Remarks */}
                        <View style={resultStyle.bottomSection}>
                          {/* Left Column: Keys and Teacher Remark */}
                          <View style={resultStyle.leftColumn}>
                            <View style={resultStyle.secondaryContainer}> 
                              <Text style={resultStyle.subtitle}>KEYS</Text>
                              <KeyTable columns={ScoreKeyColumns} data={scoreKeyData} />
                            </View>
          
                            <View style={resultStyle.remarkContainer}> 
                              <Text style={resultStyle.subtitle}>CLASSROOM TEACHER'S REMARK</Text>
                              <Text style={resultStyle.remarkText}>{getPositionRemark(result.position, result.numberOfStudentInClass)}</Text>
                            </View>
                          </View>
          
                          {/* Right Column: Next Term Fee and Resumption Date */}
                          <View style={resultStyle.rightColumn}>
                            <View style={resultStyle.secondaryContainer}> 
                              <Text style={resultStyle.subtitle}>SCHOOL NEXT TERM FEES</Text>
                              <KeyTable columns={feesKeyColumns} data={feeKeyData} />
                            </View>
          
                            <View style={resultStyle.resumptionContainer}> 
                              <Text style={resultStyle.subtitle}>NEXT TERM RESUMPTION DATE</Text>
                              <Text style={resultStyle.resumptionDate}>{ result.academicSession.resumptionDate 
            ? new Date(result.academicSession.resumptionDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : "Not Set"}</Text>
                            </View>
                          </View>
                        </View>
          
          <Text style={resultStyle.brandName}>~Generated By MiQwii Manager~</Text>
        </Page>
      ))}
    </Document>
  );

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'result.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Handle PDF View
  const handleViewPDF = async () => {
    try {
      setIsGenerating(true);
      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button 
        onClick={handleDownloadPDF} 
        disabled={isGenerating || !results || results.length === 0}
        style={{
          padding: '10px 20px',
          backgroundColor: isGenerating ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? 'Generating...' : 'Download Result'}
      </button>
      
      <button 
        onClick={handleViewPDF} 
        disabled={isGenerating || !results || results.length === 0}
        style={{
          padding: '10px 20px',
          backgroundColor: isGenerating ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? 'Generating...' : 'View Result'}
      </button>
    </div>
  );
};

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
  },
  schoolName: {
    fontSize: 15,
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
    marginTop: 5,
    fontWeight: 'bold'
  },
  secondHeader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
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
    marginTop: 10,
    width: '100%'
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    width: '100%',
    marginBottom: 5,
  },
  childContainer: {
    width: 'auto',
    flexDirection: 'column',
    paddingLeft: 10,
    margin: 0 
  },
  // New styles for bottom section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10
  },
  leftColumn: {
    width: '48%',
    flexDirection: 'column'
  },
  rightColumn: {
    width: '48%',
    flexDirection: 'column'
  },
  remarkContainer: {
    marginTop: 10,
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#3f3f3f',
    borderRadius: 4,
    backgroundColor: '#f9f9f9'
  },
  remarkText: {
    fontSize: 9,
    fontFamily: 'Roboto',
    textAlign: 'justify',
    lineHeight: 1.4
  },
  resumptionContainer: {
    marginTop: 10,
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#0e387a',
    borderRadius: 4
  
  },
  resumptionDate: {
    fontSize: 11,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e387a'
  }
});