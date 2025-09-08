import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { compact, isNaN } from "lodash";
import { get } from 'lodash';

const styles = StyleSheet.create({
  tableColStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 11,
    fontFamily: 'Roboto'
  },
  tableRowStyle: {
    flexDirection: "row",
  },
  tableStyle: {
    width: "auto",
  },
  firstTableColHeaderStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: "#dfdfdf",
  },
  firstTableColStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColHeaderStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: "#dfdfdf",
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 11,
  },
});

export const ScoreTable = (params) => {
  const { columns, showCounter = true, counterHeader = "SN" } = params;
  
  const getValue = (col, piece) => {
    let val = get(piece, col.accessorKey); // Change this line
    if (col.meta?.type === "float") {
      if (val) {
        val = parseFloat(val).toFixed(2);
        if (isNaN(val)) {
          val = "";
        }
      }
    }
    return val;
  };
  
  return (
    <View style={styles.tableStyle}>
    <View style={styles.tableRowStyle} fixed>
  {/* Counter Header */}
  {showCounter && (
    <View
      style={compact([
        styles.tableColHeaderStyle,
        styles.firstTableColHeaderStyle,
        styles.counterColStyle,
        { width: "10%" }
      ])}
    >
      <Text>{counterHeader}</Text>
    </View>
  )}
  
  {/* Regular Column Headers */}
  {columns.map((col, idx) => (
    <View
      key={idx}
      style={compact([
        styles.tableColHeaderStyle,
        !showCounter && idx === 0 ? styles.firstTableColHeaderStyle : null,
        {
          width: `${col.size}%`,
          fontWeight: col.bold ? "bold" : undefined,
        },
      ])}
    >
      {col.header && <Text>{col.header()}</Text>}
    </View>
  ))}
</View>
      {params.data.map((piece, rowIndex) => (
  <View key={rowIndex} style={styles.tableRowStyle} wrap={false}>
    {/* Counter Cell */}
    {showCounter && (
      <View
        style={compact([
          styles.tableColStyle,
          styles.firstTableColStyle,
          styles.counterColStyle,
          { width: "10%" }
        ])}
      >
        <Text>{rowIndex + 1}</Text>
      </View>
    )}
    
    {/* Regular Data Cells */}
    {columns.map((col, idx) => (
      <View
        key={idx}
        style={compact([
          styles.tableColStyle,
          !showCounter && idx === 0 ? styles.firstTableColStyle : null,
          { width: `${col.size}%` },
        ])}
      >
        <Text>{getValue(col, piece)}</Text>
      </View>
    ))}
  </View>
))}
    </View>
  );
};