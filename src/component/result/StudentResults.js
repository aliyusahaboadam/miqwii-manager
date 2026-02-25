import { Document, Font, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResultByClassId } from '../../redux/reducer/scoreSlice';
import { formatPosition } from '../utility/FormatPositon';
import { KeyTable } from './KeyTable';
import Oswald from './pdffonts/Oswald-VariableFont_wght.ttf';
import roboto from './pdffonts/RobotoRegular-3m4L.ttf';
import { ScoreTable } from './ScoreTable';

// ✅ FIX 1: Register fonts ONCE outside the component (not on every render)
Font.register({ family: 'Roboto', src: roboto });
Font.register({ family: 'Oswald', src: Oswald });

// ✅ FIX 2: Logo cache outside component so it persists across renders
const logoCache = {};

const preloadImage = async (url) => {
  // Return cached version if available
  if (logoCache[url]) return logoCache[url];
  
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    logoCache[url] = base64; // Cache it
    return base64;
  } catch (error) {
    console.error('Error preloading image:', error);
    return null;
  }
};

// ✅ FIX 3: Move MyDocument OUTSIDE StudentResults so it's not recreated every render
const MyDocument = ({ resultsData, logoUrl, positioning, formatAmount, getPositionRemark, ScoreColumns, ScoreKeyColumns, feesKeyColumns, scoreKeyData }) => {
  const feeKeyData = [
    {
      nextSSSTermFee: formatAmount(resultsData?.[0]?.academicSession?.nextSSSTermFee || "Unset"),
      nextJSSTermFee: formatAmount(resultsData?.[0]?.academicSession?.nextJSSTermFee || "Unset"),
      nextPRITermFee: formatAmount(resultsData?.[0]?.academicSession?.nextPRITermFee || "Unset"),
      nextNURTermFee: formatAmount(resultsData?.[0]?.academicSession?.nextNURTermFee || "Unset")
    }
  ];

  return (
    <Document>
      {resultsData.map((result, index) => {
        const teacherRemark = getPositionRemark(result.position, result.numberOfStudentInClass);
        const resumptionDate = result.academicSession.resumptionDate
          ? new Date(result.academicSession.resumptionDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          : "Not Set";

        return (
          <Page key={index} size="A4" style={resultStyle.body}>
            <View style={resultStyle.logoAndHeadingContainer}>
              <View style={resultStyle.logo}>
                <Image src={logoUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
                <Image src={logoUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
                  {positioning ? 'Position:' : 'No. of Subjects:'}
                  <Text style={resultStyle.detailsText}>
                    {positioning ? formatPosition(result.position) : (result.scores.length || 'N/A')}
                  </Text>
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

            <View style={resultStyle.bottomSection}>
              <View style={resultStyle.leftColumn}>
                <View style={resultStyle.secondaryContainer}>
                  <Text style={resultStyle.subtitle}>KEYS</Text>
                  <KeyTable columns={ScoreKeyColumns} data={scoreKeyData} />
                </View>
                <View style={resultStyle.remarkContainer}>
                  <Text style={resultStyle.subtitle}>CLASSROOM TEACHER'S REMARK</Text>
                  <Text style={resultStyle.remarkText}>{teacherRemark}</Text>
                </View>
              </View>

              <View style={resultStyle.rightColumn}>
                <View style={resultStyle.secondaryContainer}>
                  <Text style={resultStyle.subtitle}>SCHOOL NEXT TERM FEES</Text>
                  <KeyTable columns={feesKeyColumns} data={feeKeyData} />
                </View>
                <View style={resultStyle.resumptionContainer}>
                  <Text style={resultStyle.subtitle}>NEXT TERM RESUMPTION DATE</Text>
                  <Text style={resultStyle.resumptionDate}>{resumptionDate}</Text>
                </View>
              </View>
            </View>

            <Text style={resultStyle.brandName}>~Generated By MiQwii Manager~</Text>
          </Page>
        );
      })}
    </Document>
  );
};


const StudentResults = ({ classId }) => {
  const dispatch = useDispatch();
  const [isGenerating, setIsGenerating] = useState(false);
  const positioning = useSelector((state) => state.settings.disablePositioning);

  const formatAmount = (amount) => `N${new Intl.NumberFormat('en-NG').format(amount)}`;

  const getPositionRemark = (position, totalStudents) => {
    const percentile = ((totalStudents - position) / totalStudents) * 100;
    if (totalStudents === 1) return "Only student in class. Keep it up!";
    if (percentile >= 95) return "Outstanding! Keep up the excellent effort.";
    if (percentile >= 90) return "Excellent! You're among the very best.";
    if (percentile >= 80) return "Very good performance. Keep it up!";
    if (percentile >= 60) return "Good effort. You can do better. Aim higher!";
    if (percentile >= 40) return "Fair performance. More effort is needed.";
    if (percentile >= 20) return "Put in more effort. Seek help when needed.";
    return "Much improvement needed. Work harder!";
  };

  const ScoreColumns = [
    { accessorKey: 'subjectName', header: () => 'Subject', size: 50 },
    { accessorKey: 'max', header: () => 'Max', size: 15 },
    { accessorKey: 'firstTest', header: () => 'CA1', size: 15 },
    { accessorKey: 'secondTest', header: () => 'CA2', size: 15 },
    { accessorKey: 'totalTest', header: () => 'Sum', size: 16 },
    { accessorKey: 'exam', header: () => 'Exam', size: 15 },
    { accessorKey: 'totalExam', header: () => 'Total', size: 15 },
    { accessorKey: 'positionPerSubjectFormatted', header: () => 'Pos', size: 16 },
    { accessorKey: 'grade', header: () => 'Grade', size: 16 },
    { accessorKey: 'remark', header: () => 'Remark', size: 30 }
  ];

  const feesKeyColumns = [
    { accessorKey: 'nextSSSTermFee', header: () => 'SSS', size: 35, bold: false },
    { accessorKey: 'nextJSSTermFee', header: () => 'JSS', size: 35 },
    { accessorKey: 'nextPRITermFee', header: () => 'Primary', size: 35 },
    { accessorKey: 'nextNURTermFee', header: () => 'Nursery', size: 35 }
  ];

  const ScoreKeyColumns = [
    { accessorKey: 'a', size: 35, bold: false },
    { accessorKey: 'b', size: 35 },
    { accessorKey: 'c', size: 20 },
    { accessorKey: 'd', size: 20 },
    { accessorKey: 'e', size: 20 }
  ];

  const scoreKeyData = [
    { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' },
    { a: 'Excellence', b: 'Very Good', c: 'Good', d: 'Pass', e: 'Fail' }
  ];

  // ✅ FIX 4: Shared PDF generation logic to avoid duplication
  const generatePDF = async () => {
    const resultAction = await dispatch(getResultByClassId(classId));

    if (!getResultByClassId.fulfilled.match(resultAction)) {
      throw new Error('Failed to fetch results');
    }

    const fetchedResults = resultAction.payload;

    if (!fetchedResults || fetchedResults.length === 0) {
      throw new Error('No results found for this class.');
    }

    const s3Url = `https://d39kcxvd290stw.cloudfront.net/${fetchedResults[0]?.school?.logo}`;
    
    // ✅ FIX 5: Use cached/preloaded base64 logo instead of fetching from S3 every time
    const logoUrl = await preloadImage(s3Url);

    const blob = await pdf(
      <MyDocument
        resultsData={fetchedResults}
        logoUrl={logoUrl}
        positioning={positioning}
        formatAmount={formatAmount}
        getPositionRemark={getPositionRemark}
        ScoreColumns={ScoreColumns}
        ScoreKeyColumns={ScoreKeyColumns}
        feesKeyColumns={feesKeyColumns}
        scoreKeyData={scoreKeyData}
      />
    ).toBlob();

    return { blob, className: fetchedResults[0]?.class1?.name };
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const { blob, className } = await generatePDF();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `result-${className || classId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message || 'Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPDF = async () => {
    try {
      setIsGenerating(true);
      const { blob } = await generatePDF();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || 'Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        style={{
          padding: '10px 20px',
          backgroundColor: isGenerating ? '#ccc' : '#007bff',
          color: 'white', border: 'none', borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? 'Generating...' : 'Download Results'}
      </button>

      <button
        onClick={handleViewPDF}
        disabled={isGenerating}
        style={{
          padding: '10px 20px',
          backgroundColor: isGenerating ? '#ccc' : '#28a745',
          color: 'white', border: 'none', borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? 'Generating...' : 'View Results'}
      </button>
    </div>
  );
};

export default StudentResults;

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