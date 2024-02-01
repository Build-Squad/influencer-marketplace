import Mask_group from "@/public/svg/Mask_group.svg";
import { DISPLAY_DATE_TIME_FORMAT } from "@/src/utils/consts";
import { Attachment, Download } from "@mui/icons-material";
import { Box, Divider, Typography, Link } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EventNoteIcon from "@mui/icons-material/EventNote";

const ContentTypeComponent = ({ meta_data }: { meta_data: any }) => {
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

    default:
      return null;
  }
};

const OrderSummaryDetails = ({ orderItem = [] }: { orderItem?: any }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {orderItem.map((eachOrderItem: any, index: number) => {
        return (
          <>
            <Typography variant="h6" fontWeight={"bold"}>
              {index + 1}. {eachOrderItem?.package.name}
            </Typography>

            {eachOrderItem?.order_item_meta_data?.map((meta_data: any) => {
              return <ContentTypeComponent meta_data={meta_data} />;
            })}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
                  <EventNoteIcon sx={{ fontSize: 14, mr: 1 }} />
                  Publish Date and Time
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#676767" }}>
                  {eachOrderItem?.publish_date
                    ? dayjs(eachOrderItem?.publish_date).format(
                        DISPLAY_DATE_TIME_FORMAT
                      )
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            {eachOrderItem?.published_tweet_id && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
                    <OpenInNewIcon sx={{ fontSize: 14, mr: 1 }} />
                    Tweet Link
                  </Typography>
                  <Link
                    href={`https://x.com/${eachOrderItem?.package?.influencer?.twitter_account?.user_name}/status/${eachOrderItem?.published_tweet_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "#676767" }}
                    component={NextLink}
                  >
                    {`https://x.com/${eachOrderItem?.package?.influencer?.twitter_account?.user_name}/status/${eachOrderItem?.published_tweet_id}`}
                  </Link>
                </Box>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
          </>
        );
      })}
    </Box>
  );
};

export default OrderSummaryDetails;
