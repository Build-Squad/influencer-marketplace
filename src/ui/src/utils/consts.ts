import BasicBadge from "@/public/svg/BasicBadge.svg";
import SilverBadge from "@/public/svg/SilverBadge.svg";
import BronzeBadge from "@/public/svg/BronzeBadge.svg";
import GoldBadge from "@/public/svg/GoldBadge.svg";
import BlurredBasicBadge from "@/public/svg/Blurred_Basic.svg";
import BlurredSilverBadge from "@/public/svg/Blurred_Silver.svg";
import BlurredBronzeBadge from "@/public/svg/Blurred_Bronze.svg";
import BlurredGoldBadge from "@/public/svg/Blurred_Gold.svg";

export const BADGES = [
  {
    id: "BASIC",
    icon: BasicBadge,
    blurredIcon: BlurredBasicBadge,
    name: "Startup Shell  (0-25 %)",
    description:
      "The basic form of the turtle, symbolizing the starting point for businesses on the platform.",
  },
  {
    id: "BRONZE",
    icon: BronzeBadge,
    blurredIcon: BlurredSilverBadge,
    name: "Branded Banditurtle  (25-50 %)",
    description:
      "With the addition of a headband, the turtle is embracing its identity, marking the first steps towards recognition.",
  },
  {
    id: "SILVER",
    icon: SilverBadge,
    blurredIcon: BlurredBronzeBadge,
    name: "Badge-Adorned Warrior  (50-75 %)",
    description:
      "Now sporting a chest badge in addition to the headband, this turtle is showcasing its achievements and additional profile details.",
  },
  {
    id: "GOLD",
    icon: GoldBadge,
    blurredIcon: BlurredGoldBadge,
    name: "Swordmaster Tycoon  (75-100 %)",
    description:
      "The ultimate evolution with two swords, a headband, and a chest badge, signifying the business's complete mastery and excellence on the platform.",
  },
];

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

export const ORDER_ITEM_METRIC_TYPE = {
  ORGANIC_METRICS: "organic_metrics",
  PUBLIC_METRICS: "public_metrics",
  NON_PUBLIC_METRICS: "non_public_metrics",
};

export const SERVICE_MASTER_TWITTER_SERVICE_TYPE = {
  TWEET: "tweet",
  LIKE_TWEET: "like_tweet",
  REPLY_TO_TWEET: "reply_to_tweet",
  QUOTE_TWEET: "quote_tweet",
  POLL: "poll",
  RETWEET: "retweet",
  THREAD: "thread",
  SPACES: "spaces",
};

export const ORDER_ITEM_METRIC_TYPE_LABEL = {
  retweet_count: "Repost Count",
  like_count: "Like Count",
  reply_count: "Reply Count",
  quote_count: "Quote Count",
  bookmark_count: "Bookmark Count",
  impression_count: "Impression Count",
  user_profile_clicks: "Profile Clicks",
};

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
  DRAFT: "draft",
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

export const TRANSACTION_TYPE = {
  INITIATE_ESCROW: "initiate_escrow",
  CANCEL_ESCROW: "cancel_escrow",
  CLAIM_ESCROW: "claim_escrow",
  VALIDATE_ESCROW: "validate_escrow",
};

// SOLANA PROGRAM CONSTANTS
export const LAMPORTS_PER_SOL = 10 ** 9;

export const LOGIN_METHODS = {
  EMAIL: "email",
  TWITTER: "twitter",
  WALLET: "wallet",
};

export const CURRENCY_TYPE = {
  SOL: "SOL",
  SPL: "SPL",
};

export const CHECKOUT_TEXT =
  "Your payment will be held in an escrow smart contract for the duration of the order. The funds will be transferred to the influencer once the order is completed and validated by Xfluencer. If the influencer declines the order request, you can claim the funds back.";

export const EMAIL_PRIVACY_TEXT =
  "* Your email will not be shared or visible to anyone. It will only be used for communication purposes.";

export const TWITTER_PROMOTION_TEXT =
  "* Xfluencer will publish this promotion post on your X account. The post will be visible to your followers and the public.";

export const XFLUENCER_PROMOTION_TEXT =
  "Hi I've just signed up for XFluencer, an incredible platform connecting influencers and businesses like never before. Please find my referral code: ";

export const IDL: Xfluencer = {
  version: "1.0.0",
  name: "xfluencer",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "business",
          isMut: true,
          isSigner: true,
        },
        {
          name: "influencer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "validationAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "businessDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "influencerReceiveTokenAccount",
          isMut: false,
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
        {
          name: "rent",
          isMut: false,
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
      name: "validateEscrowSpl",
      accounts: [
        {
          name: "validationAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "influencer",
          isMut: true,
          isSigner: false,
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
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "targetState",
          type: "u8",
        },
        {
          name: "percentageFee",
          type: "u16",
        },
      ],
    },
    {
      name: "claimEscrowSpl",
      accounts: [
        {
          name: "business",
          isMut: true,
          isSigner: false,
        },
        {
          name: "businessDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "influencer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "influencerReceiveTokenAccount",
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
        {
          name: "rent",
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
      name: "cancelEscrowSpl",
      accounts: [
        {
          name: "business",
          isMut: true,
          isSigner: true,
        },
        {
          name: "businessDepositTokenAccount",
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
        {
          name: "rent",
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
          name: "validationAuthority",
          isMut: true,
          isSigner: false,
        },
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
    {
      name: "validateEscrowSol",
      accounts: [
        {
          name: "validationAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "influencer",
          isMut: true,
          isSigner: false,
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
      ],
      args: [
        {
          name: "targetState",
          type: "u8",
        },
        {
          name: "percentageFee",
          type: "u16",
        },
      ],
    },
    {
      name: "cancelEscrowSol",
      accounts: [
        {
          name: "business",
          isMut: true,
          isSigner: true,
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
      args: [],
    },
  ],
  accounts: [
    {
      name: "escrowAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "businessKey",
            type: "publicKey",
          },
          {
            name: "businessDepositTokenAccount",
            type: "publicKey",
          },
          {
            name: "influencerKey",
            type: "publicKey",
          },
          {
            name: "influencerReceiveTokenAccount",
            type: "publicKey",
          },
          {
            name: "validationAuthority",
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
        ],
      },
    },
    {
      name: "escrowAccountSolana",
      type: {
        kind: "struct",
        fields: [
          {
            name: "validationAuthority",
            type: "publicKey",
          },
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
          {
            name: "orderCode",
            type: "u64",
          },
          {
            name: "status",
            docs: [
              "status\n        0: New\n        1: Cancel\n        2: Delivered",
            ],
            type: "u8",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "EscrowAccountSolanaCreated",
      fields: [
        {
          name: "business",
          type: "publicKey",
          index: false,
        },
        {
          name: "influencer",
          type: "publicKey",
          index: false,
        },
        {
          name: "orderCode",
          type: "string",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "CannotClaim",
      msg: "Cannot claim",
    },
    {
      code: 6001,
      name: "AlreadyClaim",
      msg: "Already claim",
    },
    {
      code: 6002,
      name: "EscrowAlreadyCancel",
      msg: "Escrow already cancel for business",
    },
    {
      code: 6003,
      name: "EscrowAlreadyReleased",
      msg: "Escrow already released for influencer",
    },
    {
      code: 6004,
      name: "BadTargetStateForEscrow",
      msg: "Bad Target State for Escrow (1) for cancel, (2) for release",
    },
    {
      code: 6005,
      name: "MissmatchBusiness",
      msg: "Missmatch business public key",
    },
    {
      code: 6006,
      name: "MissmatchInfluencer",
      msg: "Missmatch influencer publick key",
    },
    {
      code: 6007,
      name: "BadEscrowState",
      msg: "Bad Escrow State",
    },
    {
      code: 6008,
      name: "MissmatchAuthority",
      msg: "Missmatch Authority",
    },
    {
      code: 6009,
      name: "PercentageFeeOutOfrange",
      msg: "Percengate Fee Out of Range",
    },
    {
      code: 6010,
      name: "NumericalProblemFoundCalculatingFees",
      msg: "Numerical Problem Found Calculating Fees",
    },
    {
      code: 6011,
      name: "BusinessHasInsufficientAmountOfTokens",
      msg: "Busines Has Insufficient Amount Of Tokens",
    },
    {
      code: 6012,
      name: "MissmatchBusinessTokenAccount",
      msg: "Missmatch Business Token Account",
    },
    {
      code: 6013,
      name: "MissmatchInfluencerTokenAccount",
      msg: "Missmatch Influencer Token Account",
    },
    {
      code: 6014,
      name: "MissmatchOrderCode",
      msg: "Missmatch Order Code",
    },
  ],
};