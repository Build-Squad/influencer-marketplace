"use client";

import NotificationIcon from "@/public/svg/Notification.svg";
import NotificationDisabledIcon from "@/public/svg/Notification_disabled.svg";
import { getService, patchService } from "@/src/services/httpServices";
import { DISPLAY_DATE_TIME_FORMAT } from "@/src/utils/consts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Badge,
  Box,
  Divider,
  Menu,
  Pagination,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { notification } from "../shared/notification";

export default function NotificationPanel() {
  const route = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);
  const openNotifications = Boolean(notificationsAnchor);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [onlyUnread, setOnlyUnread] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 10,
  });
  const unreadCountRef = useRef<number>(0);

  const getNotifications = async () => {
    try {
      const { isSuccess, data } = await getService(`/notifications/`, {
        page_number: pagination.current_page_number,
        page_size: pagination.current_page_size,
        is_read: onlyUnread ? (onlyUnread ? "False" : "True") : undefined,
      });
      if (isSuccess) {
        setNotifications(data?.data?.notifications);
        setUnreadCount(data?.data?.unread_count);
        unreadCountRef.current = data?.data?.unread_count; // update the ref value
        setPagination({
          ...pagination,
          total_data_count: data?.pagination?.total_data_count,
          total_page_count: data?.pagination?.total_page_count,
        });
      } else {
      }
    } finally {
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { isSuccess, message } = await patchService(
        `/notifications/${notificationId}/`
      );
      if (isSuccess) {
        notification("Notification marked as read", "success");
        await getNotifications();
      } else {
        notification(message ? message : "Something went wrong", "error");
      }
    } finally {
    }
  };

  const markAllAsRead = async () => {
    try {
      const { isSuccess, message } = await patchService(
        `/notifications/all-read/`
      );
      if (isSuccess) {
        notification("All notifications marked as read", "success");
        await getNotifications();
      } else {
        notification(message ? message : "Something went wrong", "error");
      }
    } finally {
    }
  };

  const handleClickNotifications = (event: any) => {
    setNotificationsAnchor(event.currentTarget);
  };
  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleOnlyUnread = () => {
    setOnlyUnread((prev) => !prev);
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };

  useEffect(() => {
    setOnlyUnread(null);
  }, [openNotifications]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getNotifications();
    }, 500);

    // Set up the interval
    const intervalId = setInterval(() => {
      getNotifications();
    }, 30000); // 30000 milliseconds = 30 seconds

    return () => {
      clearTimeout(delayDebounceFn);
      clearInterval(intervalId); // Clear the interval when the component is unmounted
    };
  }, [
    pagination.current_page_number,
    pagination.current_page_size,
    onlyUnread,
  ]);

  return (
    <>
      <Badge
        badgeContent={unreadCount}
        color="secondary"
        onClick={handleClickNotifications}
      >
        <Image
          src={openNotifications ? NotificationIcon : NotificationDisabledIcon}
          alt={"Notification"}
          height={16}
        />
      </Badge>
      <Menu
        id="basic-menu"
        anchorEl={notificationsAnchor}
        open={openNotifications}
        onClose={handleCloseNotifications}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 600,
              borderRadius: "none",
              boxShadow: "0px 3px 7px #00000026",
              minHeight: 300,
              maxHeight: 700,
              overflow: "auto",
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <Box key="header" sx={{ mt: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: { xs: 14, md: 18 },
                fontWeight: 500,
                color: "secondary.main",
              }}
            >
              Notifications
            </Typography>

            <Stack direction="row" alignItems="center">
              <Typography variant="body2">Show only unread</Typography>
              <Switch
                checked={onlyUnread ? onlyUnread : false}
                onChange={handleOnlyUnread}
                inputProps={{ "aria-label": "controlled" }}
                color="secondary"
              />
            </Stack>
          </Stack>
          <Divider sx={{ mt: 1 }} />
          {unreadCount > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                sx={{
                  mt: 1,
                  fontFamily: "Merriweather Sans, sans-serif",
                  fontSize: 12,
                  fontWeight: 200,
                  textAlign: "end",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => {
                  markAllAsRead();
                }}
              >
                Mark all as read
              </Typography>
            </Box>
          )}
          {notifications?.length > 0 ? (
            <>
              <Box>
                {notifications.map((item: NotificationType) => (
                  <Box
                    key={item.id}
                    sx={{
                      backgroundColor: "#f9f9f9",
                      mt: 1,
                      borderRadius: "4px",
                      borderLeft: "5px solid #000",
                      py: 1,
                      px: 2,
                      cursor: item?.slug ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (item?.slug) {
                        route.push(item.slug);
                        handleCloseNotifications();
                      }
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* Title */}
                        <Tooltip
                          title={item.title}
                          placement="top"
                          arrow
                          // Only show tooltip if title is truncated
                          disableHoverListener={item?.title?.length < 30}
                        >
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 400,
                              color: "secondary.main",
                            }}
                          >
                            {item?.title?.length > 30 ? (
                              <>{item?.title?.slice(0, 30)}...</>
                            ) : (
                              <>{item?.title}</>
                            )}
                          </Typography>
                        </Tooltip>
                        {/* Time Stramp */}
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 200,
                          }}
                        >
                          {dayjs(item.created_at).format(
                            DISPLAY_DATE_TIME_FORMAT
                          )}
                        </Typography>
                        {/* Read/Unread */}
                        {item.is_read ? (
                          <CheckCircleIcon
                            sx={{
                              height: 20,
                              width: 20,
                              color: "success.main",
                            }}
                          />
                        ) : (
                          <Tooltip title="Mark as read" placement="right" arrow>
                            <RadioButtonUncheckedIcon
                              sx={{ height: 20, width: 20, cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(item.id);
                              }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                    <Tooltip
                      title={item.message}
                      placement="top"
                      arrow
                      // Only show tooltip if message is truncated
                      disableHoverListener={item?.message?.length < 100}
                    >
                      <Typography
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          color: "#666666",
                          fontSize: 12,
                          fontWeight: 400,
                        }}
                      >
                        {item?.message?.length > 100
                          ? `${item?.message?.slice(0, 100)}...`
                          : item?.message}
                      </Typography>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Pagination
                  count={pagination.total_page_count}
                  page={pagination.current_page_number}
                  onChange={handlePaginationChange}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  color="secondary"
                  shape="rounded"
                />
              </Box>
            </>
          ) : (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{ mt: "10vh", mb: "10vh" }}
            >
              <Typography
                color="#10375C"
                fontFamily="Montserrat, sans-serif"
                fontWeight="500"
              >
                No notifications found.
              </Typography>
            </Stack>
          )}
        </Box>
      </Menu>
    </>
  );
}
