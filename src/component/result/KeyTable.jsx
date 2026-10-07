import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { compact, isNaN } from "lodash";

const styles = StyleSheet.create({
  tableColStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 9.5,
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
});

export const KeyTable = (params) => {
  const { columns, layout = "horizontal" } = params;

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

  // --- NEW: vertical layout (label on the left, value on the right) ---
if (layout === "vertical") {
  const row = params.data?.[0] ?? {};

  const bodyCell = {
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 9.5,
    fontFamily: "Roboto",
  };

  return (
    <View style={styles.tableStyle}>
      {columns.map((col, idx) => {
        const isFirstRow = idx === 0;
        return (
          <View key={idx} style={styles.tableRowStyle} wrap={false}>
            <View
              style={compact([
                styles.tableColStyle,
                styles.firstTableColStyle,
                isFirstRow ? { borderTopWidth: 1 } : null,
                bodyCell,
                { width: "65%" },
              ])}
            >
              <Text>{col.header ? col.header() : ""}</Text>
            </View>
            <View
              style={compact([
                styles.tableColStyle,
                isFirstRow ? { borderTopWidth: 1 } : null,
                bodyCell,
                { width: "35%" },
              ])}
            >
              <Text>{getValue(col, row)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
  // --- END NEW ---

  return (
    <View style={styles.tableStyle}>
      <View style={styles.tableRowStyle} fixed>
        {columns.map((col, idx) => (
          <View
            key={idx}
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
      {params.data.map((piece, rowIdx) => (
        <View key={rowIdx} style={styles.tableRowStyle} wrap={false}>
          {columns.map((col, idx) => (
            <View
              key={idx}
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