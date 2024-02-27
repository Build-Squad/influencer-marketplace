import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
type ArrayItemProps = {
  formFields: any;
  updatevalues: any;
};

export default function ArrayItem({
  formFields,
  updatevalues,
}: ArrayItemProps) {
  const [arrayValues, setArrayValues] = useState<string[]>([]);
  useEffect(() => {
    if (formFields?.value) {
      // Value if present will be comma separated string
      const values = formFields.value.split(",");
      setArrayValues(values);
    } else {
      setArrayValues([""]);
    }
  }, [formFields]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {arrayValues.map((value, index) => {
          return (
            <Grid item key={index} xs={12}>
              {arrayValues?.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormLabel component="legend">{`${index + 1} / ${
                    arrayValues?.length
                  }`}</FormLabel>
                  <Tooltip title="Remove">
                    <IconButton
                      onClick={() => {
                        const newValues = [...arrayValues];
                        newValues.splice(index, 1);
                        setArrayValues(newValues);
                        const value = newValues.join(",");
                        updatevalues(value);
                      }}
                    >
                      <HighlightOffIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <TextField
                value={value}
                size="small"
                fullWidth
                color="secondary"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                multiline={!formFields?.label.includes("Poll")}
                rows={4}
                placeholder={formFields?.placeholder}
                onChange={(e) => {
                  const newValues = [...arrayValues];
                  newValues[index] = e.target.value;
                  setArrayValues(newValues);
                  const newValue = newValues.join(",");
                  updatevalues(newValue);
                }}
                InputProps={{
                  inputProps: {
                    maxLength: formFields?.max,
                  },
                }}
                helperText={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {formFields?.max
                      ? `${value?.length ? value?.length : 0}/${
                          formFields?.max
                        }`
                      : ""}
                  </Box>
                }
              />
            </Grid>
          );
        })}
      </Grid>

      <Grid item xs={12}>
        <Box
          component="span"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title="Add">
            <IconButton
              onClick={() => {
                setArrayValues([...arrayValues, ""]);
              }}
              disabled={
                formFields?.label.includes("Poll") && arrayValues?.length >= 4
              }
            >
              <AddCircleOutlineIcon
                color={
                  formFields?.label.includes("Poll") && arrayValues?.length >= 4
                    ? "disabled"
                    : "success"
                }
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </Box>
  );
}
