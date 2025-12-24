import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import { useDispatch, useSelector} from 'react-redux';
import { getClassCountSpecificJSS, getClassCountSpecificNur, getClassCountSpecificSSS, getClassCountSpecificPRI, getClassCount, getClassCountSpecific } from '../../redux/reducer/classSlice';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStudentCountDetails } from '../../redux/reducer/studentSlice';

const SchoolDemographicsCharts = () => {


   

    const classState = useSelector((state) => state.classes);
    const { classNamesSpecific,  classCount,  classCountSpecificJSS,classCountSpecificNur, classCountSpecificSSS, classCountSpecificPRI} = classState;
    
    const studentState = useSelector((state) => state.students);
    const {studentCountDetails } = studentState;
   const dispatch = useDispatch();
    



       useEffect(() => {
            dispatch(getStudentCountDetails());
            dispatch(getClassCountSpecificJSS('J'));
            dispatch(getClassCountSpecificSSS('S'));
            dispatch(getClassCountSpecificPRI('P'));
            dispatch(getClassCountSpecificPRI('N'));
        }, []);
      
        // const fetchData = () => {
        //     dispatch(getClassCount());
        //     dispatch(getClassCountSpecificJSS('J'));
        //     dispatch(getClassCountSpecificSSS('S'));
        //     dispatch(getClassCountSpecificPRI('P'));
        // }



    const PRI = classCountSpecificPRI?.length || 0;
    const JSS = classCountSpecificJSS?.length || 0;
    const SSS = classCountSpecificSSS?.length || 0;
    const NUR = classCountSpecificSSS?.length || 0;

   

    const PRI_TEACHERS = classCountSpecificPRI[0]?.teachers?.length || 0;
    const JSS_TEACHERS  = classCountSpecificJSS[0]?.teachers?.length || 0;
    const SSS_TEACHERS  = classCountSpecificSSS[0]?.teachers?.length || 0;
    const NUR_TEACHERS  = classCountSpecificNur[0]?.teachers?.length || 0;

  const chartStyle =  {

    container: {
      width: '100%',
      backgroundColor: '#f8f9fa',
      padding: '10px',
      fontFamily: 'Roboto'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '0px',
      color: '#0e387a'
    },
    chartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '10px',
      marginBottom: '0px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '0px',
      margin: '0'
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: '500',
      marginBottom: '0px',
      textAlign: 'center',
      color: '#9a99ac',
      fontFamily: 'Roboto',
      fontStyle: 'italic'
    },
    chartTotal: {
      marginTop: '16px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#0e387a'
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '10px'
    },
    summaryTitle: {
      fontSize: '15px',
      fontWeight: '500',
      marginBottom: '10px',
      textAlign: 'center',
      color: '#0e387a'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    summaryItem: {
      textAlign: 'center',
      padding: '16px',
      borderRadius: '8px'
    },
    summaryItemTitle: {
      fontSize: '10px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    summaryItemValue: {
      fontSize: '20px',
      fontWeight: 'bold'
    }
  };

  const summaryStyles = {
    students: {
      ...chartStyle.summaryItem,
      backgroundColor: '#e3f2fd',
      color: '#0e387a'
    },
    staff: {
      ...chartStyle.summaryItem,
      backgroundColor: '#e8f5e8',
      color: '#0e387a'
    },
    classes: {
      ...chartStyle.summaryItem,
      backgroundColor: '#f3e5f5',
      color: '#0e387a'
    }
  };
  // Sample data for students by gender
  const studentGenderData = [
    { name: 'Female Students', value: studentCountDetails?.femaleCount, color: '#007CC3' },
    { name: 'Male Students', value: studentCountDetails?.maleCount, color: '#00529B' }
  ];

  // Sample data for teachers
  const teacherData = [
    { name: 'Primary Teachers',value: PRI_TEACHERS, color: '#00008B' },
    { name: 'JSS Teachers', value: JSS_TEACHERS, color: '#1F75FE' },
    { name: 'SSS Teachers',value:  SSS_TEACHERS, color: '#74BBFB' },
    { name: 'Nursery Teachers',value:  NUR_TEACHERS, color: '#5788b3ff' }
  ];

  // Sample data for classes
  const classData = [
    { name: 'Primary Classes', value: PRI, color: '#7D77DE' },
    { name: 'Nursery Classes', value: NUR , color: '#1432dcff' },
    { name: 'JSS Classes', value: JSS, color: '#013375' },
    { name: 'SSS Classes', value: SSS , color: '#0167AD' }
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={chartStyle.container}>

        <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>

    
        {/* Student Gender Distribution */}
        <div style={chartStyle.chartCard}>
          <h2 style={chartStyle.chartTitle}>Student Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentGenderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                fontFamily='Roboto'
              >
                {studentGenderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Students']} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={chartStyle.chartTotal}>
            <p>Total Students: {studentGenderData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
        </div>

        {/* Teacher Distribution */}
        <div style={chartStyle.chartCard}>
          <h2 style={chartStyle.chartTitle}>Teacher Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teacherData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {teacherData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Staff']} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={chartStyle.chartTotal}>
            <p>Teacher in Class: {teacherData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
        </div>

        {/* Class Distribution */}
        <div style={chartStyle.chartCard}>
          <h2 style={chartStyle.chartTitle}>Class Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {classData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Classes']} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={chartStyle.chartTotal}>
            <p>Total Classes: {classData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={chartStyle.summaryCard}>
        <h2 style={chartStyle.summaryTitle}>School Summary</h2>
        <div style={chartStyle.summaryGrid}>
          <div style={summaryStyles.students}>
            <h3 style={chartStyle.summaryItemTitle}>Total Students</h3>
            <p style={chartStyle.summaryItemValue}>{studentGenderData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
          <div style={summaryStyles.staff}>
            <h3 style={chartStyle.summaryItemTitle}>Teacher in Class</h3>
            <p style={chartStyle.summaryItemValue}>{teacherData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
          <div style={summaryStyles.classes}>
            <h3 style={chartStyle.summaryItemTitle}>Total Classes</h3>
            <p style={chartStyle.summaryItemValue}>{classData.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDemographicsCharts;


const legendStyle = {
  fontSize: '16px',        // Make it larger
  fontWeight: '500',      // Make it bolder
  color: '#9a99ac',           // Change color
  fontFamily: 'Roboto',     // Change font family
  margin: '0px'
};