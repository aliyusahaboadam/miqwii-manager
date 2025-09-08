import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { compact, isNaN } from "lodash";

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

export const KeyTable = (params) => {
  const { columns } = params;
  
  const getValue = (col, piece) => {
    let val = piece[col.accessorKey];
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
        {columns.map((col, idx) => (
          <View
            style={compact([
              styles.tableColHeaderStyle,
              idx == 0 ? styles.firstTableColHeaderStyle : null,
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
      {params.data.map((piece) => (
        <View style={styles.tableRowStyle} wrap={false}>
          {columns.map((col, idx) => (
            <View
              style={compact([
                styles.tableColStyle,
                idx == 0 ? styles.firstTableColStyle : null,
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