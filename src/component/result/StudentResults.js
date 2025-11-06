import {Document, Image, Page, pdf, View, StyleSheet, Font} from '@react-pdf/renderer';
import { ScoreTable } from './ScoreTable';
import { KeyTable } from './KeyTable';
import { Text } from '@react-pdf/renderer';
import roboto from './pdffonts/RobotoRegular-3m4L.ttf';
import Oswald from './pdffonts/Oswald-VariableFont_wght.ttf';
import { getResultByClassId } from '../../redux/reducer/scoreSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const StudentResults = ({ classId }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector((state) => state.scores);
  const { results, fetchingStatus } = scoreState;
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const formatAmount = (amount) => {
    return `NGN${new Intl.NumberFormat('en-NG').format(amount)}`;
  };

  // Filter results for this specific class
  const filteredResults = results?.filter(result => result?.class1?.id === classId) || [];

  console.log("ClassId:", classId);
  console.log("All results:", results);
  console.log("Filtered results for this class:", filteredResults);

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
      header: () => 'CA Total', 
      size: 20,
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

  // PDF Document Component
  const MyDocument = ({ resultsData }) => {
    const feeKeyData = [
      {
        nextSSSTermFee: formatAmount(resultsData?.[0]?.academicSession?.nextSSSTermFee || 0),
        nextJSSTermFee: formatAmount(resultsData?.[0]?.academicSession?.nextJSSTermFee || 0),
        nextPRITermFee: formatAmount(resultsData?.[0]?.academicSession?.nextPRITermFee || 0)
      }
    ];

    return (
      <Document>
        {resultsData.map((result, index) => (
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
            
            <View style={resultStyle.secondaryContainer}> 
              <Text style={resultStyle.subtitle}>KEYS</Text>
              <KeyTable columns={ScoreKeyColumns} data={scoreKeyData} />
            </View>

            <View style={resultStyle.secondaryContainer}> 
              <Text style={resultStyle.subtitle}>SCHOOL NEXT TERM FEES</Text>
              <KeyTable columns={feesKeyColumns} data={feeKeyData} />
            </View>
            
            <Text style={resultStyle.brandName}>~Generated By MiQwii Manager~</Text>
          </Page>
        ))}
      </Document>
    );
  };

  // Fetch results when button is clicked
  const fetchAndWait = async () => {
    setHasFetched(false);
    await dispatch(getResultByClassId(classId));
    // Wait for state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasFetched(true);
  };

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Fetch results
      await fetchAndWait();
      
      // Get the latest results from Redux after fetch
      const currentResults = scoreState.results?.filter(result => result?.class1?.id === classId) || [];
      
      console.log("Results after fetch:", currentResults);
      
      if (!currentResults || currentResults.length === 0) {
        alert('No results found for this class. Please ensure results have been generated.');
        setIsGenerating(false);
        return;
      }

      const blob = await pdf(<MyDocument resultsData={currentResults} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `results-${currentResults[0]?.class1?.name || 'class'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error generating PDF: ' + error.message);
    }
  };

  // Handle PDF View
  const handleViewPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Fetch results
      await fetchAndWait();
      
      // Get the latest results from Redux after fetch
      const currentResults = scoreState.results?.filter(result => result?.class1?.id === classId) || [];
      
      console.log("Results after fetch:", currentResults);
      
      if (!currentResults || currentResults.length === 0) {
        alert('No results found for this class. Please ensure results have been generated.');
        setIsGenerating(false);
        return;
      }

      const blob = await pdf(<MyDocument resultsData={currentResults} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error generating PDF: ' + error.message);
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
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontSize: '14px'
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
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontSize: '14px'
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
    width: '50%'
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
  }
});