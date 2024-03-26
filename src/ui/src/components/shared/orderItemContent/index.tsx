import { DISPLAY_DATE_TIME_FORMAT } from "@/src/utils/consts";
import { Attachment, Download } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import Mask_group from "@/public/svg/Mask_group.svg";

export const ContentTypeComponent = ({ meta_data }: { meta_data: any }) => {
  switch (meta_data.field_type) {
    case "text":
    case "long_text":
      return (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mt: 2, color: "#9E9E9E" }}>
            <Image
              src={Mask_group}
              height={14}
              alt="Mask_group"
              style={{ marginRight: "8px" }}
            />
            {meta_data?.label}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              position: "relative",
              color: "#676767",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {meta_data?.value ? meta_data?.value : "N/A"}
          </Typography>
        </Box>
      );

    case "media":
      return (
        <Box
          sx={{
            mb: 2,
            borderRadius: "24px",
            border: "1px solid #E8E8E8",
            background: "#F8F8F8",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", columnGap: "8px", alignItems: "center" }}>
            <Attachment />
            <Typography>Media</Typography>
          </Box>
          <Download />
        </Box>
      );

    case "date_time":
      return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
              {meta_data?.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#676767" }}>
              {meta_data?.value
                ? dayjs(meta_data?.value).format(DISPLAY_DATE_TIME_FORMAT)
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      );

    case "array":
      return (
        // Comma separated values
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "20px",
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
            <Image
              src={Mask_group}
              height={14}
              alt="Mask_group"
              style={{ marginRight: "8px" }}
            />
            {meta_data?.label}
          </Typography>
          {meta_data?.value?.split(",").map((value: string, index: number) => {
            return (
              <Box key={index}>
                <Typography variant="subtitle1" sx={{ color: "#676767" }}>
                  {`${index + 1}. `}
                  {value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    default:
      return null;
  }
};
