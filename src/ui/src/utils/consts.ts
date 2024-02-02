export const DISPLAY_DATE_FORMAT = "DD MMM YYYY";

export const DISPLAY_TIME_FORMAT = "HH:mm A";

export const DISPLAY_DATE_TIME_FORMAT = "DD MMM YYYY hh:mm A";

export const ISO_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS";

export const FORM_DATE_FORMAT = "YYYY-MM-DD";

export const FORM_DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

// Date time format for date time picker with time zone aware
export const FORM_DATE_TIME_TZ_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export const PACKAGE_STATUS = {
  DRAFT: {
    value: "draft",
    label: "Draft",
  },
  PUBLISHED: {
    value: "published",
    label: "Published",
  },
};

export const LOGIN_STATUS_SUCCESS = "User successfully logged in!";
export const LOGIN_STATUS_FAILED = "Failed user login. Please try again!";
export const LOGOUT_SUCCESS = "User successfully logged out!";

export const ORDER_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  DRAFT: "draft",
  ACCEPTED: "accepted",
};

export const ORDER_ITEM_STATUS = {
  IN_PROGRESS: "in_progress",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
};

export const SERVICE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const ROLE_NAME = {
  INFLUENCER: "influencer",
  BUSINESS_OWNER: "business_owner",
};

export const MESSAGE_STATUS = {
  READ: "read",
  SENT: "sent",
  DELIVERED: "delivered",
};

export const IDL: Xfluencer = {
  version: "0.1.0",
  name: "xfluencer",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buyer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: false,
          isSigner: false,
        },
        {
          name: "judge",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "buyerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerReceiveTokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "vaultAccountBump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "orderCode",
          type: "u64",
        },
      ],
    },
    {
      name: "cancel",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buyerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "orderCode",
          type: "u64",
        },
      ],
    },
    {
      name: "createEscrow",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "from",
          isMut: true,
          isSigner: true,
        },
        {
          name: "to",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "orderCode",
          type: "u64",
        },
      ],
    },
    {
      name: "claimEscrow",
      accounts: [
        {
          name: "influencer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "business",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "orderCode",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "escrowAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "buyerKey",
            type: "publicKey",
          },
          {
            name: "buyerDepositTokenAccount",
            type: "publicKey",
          },
          {
            name: "sellerKey",
            type: "publicKey",
          },
          {
            name: "sellerReceiveTokenAccount",
            type: "publicKey",
          },
          {
            name: "judgeKey",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "orderCode",
            type: "u64",
          },
          {
            name: "status",
            docs: [
              "status\n        0: New\n        1: Shipping\n        2: Delivered",
            ],
            type: "u8",
          },
          {
            name: "deliveryTime",
            type: "i64",
          },
          {
            name: "trialDay",
            type: "u16",
          },
        ],
      },
    },
    {
      name: "escrowAccountSolana",
      type: {
        kind: "struct",
        fields: [
          {
            name: "from",
            type: "publicKey",
          },
          {
            name: "to",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
        ],
      },
    },
  ],
};
