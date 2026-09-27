// File: src/component/promotion/PromotionMappingRow.jsx
import { Delete as DeleteIcon } from "@mui/icons-material";
import { IconButton, MenuItem, Select, Typography } from "@mui/material";

/**
 * One row in the promotion mapping table.
 *
 * Props:
 *   row               { sourceClassId, sourceClassName, targetClassId, graduate }
 *   allClasses        [{ id, name }]  — every class in the school except sources already mapped
 *   onChange(row)     called when user changes target or graduate
 *   onRemove()        called when user removes the row
 */
const PromotionMappingRow = ({ row, allClasses, onChange, onRemove }) => {

    const handleTargetChange = (e) => {
        onChange({ ...row, targetClassId: e.target.value, graduate: false });
    };

    const handleGraduateToggle = () => {
        onChange({ ...row, graduate: !row.graduate, targetClassId: null });
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr 1fr 0.4fr",
                gap: "1rem",
                alignItems: "center",
                padding: "0.8rem 1rem",
                borderBottom: "1px solid #eee",
            }}
        >
            {/* Source class */}
            <Typography sx={{ fontSize: 17, fontWeight: 600, color: "#0e387a" }}>
                {row.sourceClassName}
            </Typography>

            {/* Target class dropdown */}
            <Select
                value={row.graduate ? "" : (row.targetClassId || "")}
                onChange={handleTargetChange}
                displayEmpty
                disabled={row.graduate}
                size="small"
                sx={{ fontSize: 16 }}
            >
                <MenuItem value="" disabled sx={{ fontSize: 16 }}>
                    {row.graduate ? "Graduating (no target)" : "Select target class"}
                </MenuItem>
                {allClasses.map((c) => (
                    <MenuItem key={c.id} value={c.id} sx={{ fontSize: 16 }}>
                        {c.name}
                    </MenuItem>
                ))}
            </Select>

            {/* Graduate toggle */}
            <button
                type="button"
                onClick={handleGraduateToggle}
                style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: row.graduate ? "#0e387a" : "#e0e0e0",
                    color: row.graduate ? "#fff" : "#333",
                }}
            >
                {row.graduate ? "Graduate ✓" : "Mark Graduate"}
            </button>

            {/* Remove */}
            <IconButton onClick={onRemove} size="small">
                <DeleteIcon sx={{ fontSize: 22, color: "#c43e3e" }} />
            </IconButton>
        </div>
    );
};

export default PromotionMappingRow;