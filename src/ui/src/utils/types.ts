type PaginationType = {
  total_data_count: number;
  total_page_count: number;
  current_page_number: number;
  current_page_size: number;
};

type CountryType = {
  id: string;
  name: string;
  country_code: string;
};

type CurrencyType = {
  id: string;
  name: string;
  symbol: string;
  token_address?: string;
  decimals?: number;
  logourl?: string;
  currency_type?: string;
};

type LanguageType = {
  id: string;
  langCode: string;
  langEnglishName: string;
  langNativeName: string;
};

type RegionType = {
  id: string;
  regionName: string;
};

type ServiceMasterMetaDataType = {
  id: string;
  field_name: string;
  label: string;
  placeholder: string;
  min: string;
  max: string;
  span: number;
  field_type: string;
  service_master_id: string;
  value: string | null;
  order: number;
  regex: string | null;
};

type ServiceMasterType = {
  id: string;
  name: string;
  description: string;
  limit: string;
  type: string;
  created_at: string;
  deleted_at: string | null;
  is_duration_based: boolean;
  service_master_meta_data: ServiceMasterMetaDataType[];
  twitter_service_type: string;
};

type PackageType = {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  deleted_at: string | null;
  status: string;
  publish_date: string;
  influencer: InfleuncerType;
  currency: CurrencyType;
};

type ServiceType = {
  id: string;
  service_master: ServiceMasterType;
  package: PackageType;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
  deleted_at: string | null;
  currency: CurrencyType;
  start_date: null | string;
  end_date: null | string;
  platform_fees: string;
  platform_price: string;
};

type ConstSelectType = {
  value: string;
  label: string;
} | null;

type CategoryMasterType = {
  id: string;
  name: string;
  description: string;
};

type RoleType = {
  id: string;
  name: string;
};

type TwitterAccountType = {
  description: string;
  followers_count: number;
  following_count: number;
  id: string;
  listed_count: number;
  name: string;
  profile_image_url: string;
  tweet_count: number;
  twitter_id: string;
  user_name: string;
  verified: boolean;
  location: string | null;
  url: string | null;
  joined_at: string | null;
  account_categories?: AccountCategoryType[];
  rating?: number;
  is_bookmarked?: boolean | null;
};

type UserType = {
  id: string;
  date_joined: string;
  email: string | null;
  email_verified_at: string | null;
  first_name: string | null;
  joined_at: string;
  last_login: string | null;
  last_name: string | null;
  status: string | null;
  username: string | null;
  role: RoleType;
  twitter_account: TwitterAccountType | null;
  wallets: WalletType[] | null;
  region?: {
    id: string;
    region: string;
    user_account: string;
  };
  login_method: string;
  promoted_tweet_id?: string | null;
};

type RewardPointType = {
  id: string;
  points: number;
  reward_configuration: string;
  user_account: string;
};

type UserReferralsType = {
  id: string;
  referred_by: UserType;
  user_account: UserType;
  referred_by_reward_point: RewardPointType;
};

type ServiceCheckOutType = {
  serviceItem: ServiceType;
  quantity: number;
  price: number;
};

type AccountCategoryType = {
  id: string;
  category: CategoryMasterType;
  twitter_account: string;
};

interface Window {
  ethereum: any;
  web3: any;
  phantom: any;
}

type WalletProviderType = {
  id: string;
  wallet_provider: string;
};

type WalletNetworkType = {
  id: string;
  wallet_network: string;
};

type WalletType = {
  id: string;
  wallet_address_id: string;
  wallet_network_id: WalletNetworkType;
  wallet_provider_id: WalletProviderType;
  is_primary: boolean;
};

type TwiiterAccountReadType = {
  id: string;
  twitter_id: string;
  name: string;
  user_name: string;
  profile_image_url: string;
};

type InfleuncerType = {
  id: string;
  first_name: string;
  last_name: null;
  twitter_account: TwiiterAccountReadType;
};

type OrderItemMetaDataType = {
  id?: string;
  label: string;
  span: number;
  field_type: string;
  value: string | null;
  order_item?: string;
  service_master_meta_data_id?: string;
  min: string;
  max: string;
  placeholder: string;
  order: number;
  regex: string | null;
};

type OrderItemType = {
  id?: string;
  package: PackageType;
  service_master: ServiceMasterType;
  currency: CurrencyType;
  price: string;
  created_at: Date | string;
  platform_fee: string;
  platform_price: string;
  order_id?: OrderType;
  order_item_meta_data: OrderItemMetaDataType[];
  publish_date?: string;
  published_tweet_id?: string;
  status?: string;
  approved?: boolean;
  is_verified?: boolean;
  allow_manual_approval?: boolean;
};

type TransactionType = {
  amount: number | null;
  id: string;
  order: string;
  status: string;
  transaction_type: string;
  transaction_address: string;
  transaction_date: string;
  transaction_initiated_by: string;
  wallet: string;
};

type ReviewType = {
  id: string;
  order: string;
  note: string;
  is_visible: boolean;
  rating: number;
};

type OrderType = {
  id?: string;
  buyer?: UserType;
  buyer_meta_data?: unknown;
  order_item_order_id?: OrderItemType[];
  amount?: number;
  currency?: CurrencyType;
  description?: null;
  status?: string;
  created_at?: Date;
  order_code?: string;
  buyer_wallet?: WalletType;
  influencer_wallet?: WalletType;
  order_number?: number;
  transactions?: TransactionType[] | null;
  review?: ReviewType | null;
};

type OrderFilterType = {
  search?: string;
  influencers?: string[];
  buyers?: string[];
  status?: string[];
  service_masters?: string[];
  lt_created_at?: string;
  gt_created_at?: string;
  lt_rating?: string;
  gt_rating?: string;
  lt_amount?: string;
  gt_amount?: string;
  order_by?: string;
  objects?: {
    influencers?: UserType[];
    buyers?: UserType[];
    service_masters?: ServiceMasterType[];
  };
};

type NotificationType = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  slug: string;
  user: string;
};

type MessageType = {
  id: string;
  status: string;
  message: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  order_id: string;
  is_read: boolean;
  isMe?: boolean;
  is_system_message?: boolean;
};

type OrderChatMessageType = {
  message: MessageType;
  order_unread_messages_count: number;
};

type OrderChatType = {
  order: OrderType;
  order_message: OrderChatMessageType;
};

type ChatDisplayType = {
  username?: string;
  profile_image_url?: string | null;
  message?: OrderChatMessageType;
};

type OrderItemMetricType = {
  id: string;
  order_item: string;
  metric: string;
  value: string;
  created_at: Date | string;
  type: string;
};

type OrderItemMetricFilterType = {
  type?: string[];
  metric?: string[];
  gt_created_at?: string | null;
  lt_created_at?: string | null;
};

interface SVGIcon
  extends React.FunctionComponent<React.SVGAttributes<HTMLOrSVGElement>> {}

declare module "*.svg?icon" {
  const content: SVGIcon;
  export default content;
}

type Xfluencer = {
  version: "1.0.0";
  name: "xfluencer";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "business";
          isMut: true;
          isSigner: true;
        },
        {
          name: "influencer";
          isMut: false;
          isSigner: false;
        },
        {
          name: "validationAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "businessDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "influencerReceiveTokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "vaultAccountBump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "orderCode";
          type: "u64";
        }
      ];
    },
    {
      name: "validateEscrowSpl";
      accounts: [
        {
          name: "validationAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "influencer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "business";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "targetState";
          type: "u8";
        },
        {
          name: "percentageFee";
          type: "u16";
        }
      ];
    },
    {
      name: "claimEscrowSpl";
      accounts: [
        {
          name: "business";
          isMut: true;
          isSigner: false;
        },
        {
          name: "businessDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "influencer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "influencerReceiveTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "orderCode";
          type: "u64";
        }
      ];
    },
    {
      name: "cancelEscrowSpl";
      accounts: [
        {
          name: "business";
          isMut: true;
          isSigner: true;
        },
        {
          name: "businessDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "orderCode";
          type: "u64";
        }
      ];
    },
    {
      name: "createEscrow";
      accounts: [
        {
          name: "validationAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrow";
          isMut: true;
          isSigner: false;
        },
        {
          name: "from";
          isMut: true;
          isSigner: true;
        },
        {
          name: "to";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "orderCode";
          type: "u64";
        }
      ];
    },
    {
      name: "claimEscrow";
      accounts: [
        {
          name: "influencer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "business";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "orderCode";
          type: "u64";
        }
      ];
    },
    {
      name: "validateEscrowSol";
      accounts: [
        {
          name: "validationAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "influencer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "business";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "targetState";
          type: "u8";
        },
        {
          name: "percentageFee";
          type: "u16";
        }
      ];
    },
    {
      name: "cancelEscrowSol";
      accounts: [
        {
          name: "business";
          isMut: true;
          isSigner: true;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "escrowAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "businessKey";
            type: "publicKey";
          },
          {
            name: "businessDepositTokenAccount";
            type: "publicKey";
          },
          {
            name: "influencerKey";
            type: "publicKey";
          },
          {
            name: "influencerReceiveTokenAccount";
            type: "publicKey";
          },
          {
            name: "validationAuthority";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "orderCode";
            type: "u64";
          },
          {
            name: "status";
            docs: [
              "status\n        0: New\n        1: Shipping\n        2: Delivered"
            ];
            type: "u8";
          }
        ];
      };
    },
    {
      name: "escrowAccountSolana";
      type: {
        kind: "struct";
        fields: [
          {
            name: "validationAuthority";
            type: "publicKey";
          },
          {
            name: "from";
            type: "publicKey";
          },
          {
            name: "to";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "orderCode";
            type: "u64";
          },
          {
            name: "status";
            docs: [
              "status\n        0: New\n        1: Cancel\n        2: Delivered"
            ];
            type: "u8";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "EscrowAccountSolanaCreated";
      fields: [
        {
          name: "business";
          type: "publicKey";
          index: false;
        },
        {
          name: "influencer";
          type: "publicKey";
          index: false;
        },
        {
          name: "orderCode";
          type: "string";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "CannotClaim";
      msg: "Cannot claim";
    },
    {
      code: 6001;
      name: "AlreadyClaim";
      msg: "Already claim";
    },
    {
      code: 6002;
      name: "EscrowAlreadyCancel";
      msg: "Escrow already cancel for business";
    },
    {
      code: 6003;
      name: "EscrowAlreadyReleased";
      msg: "Escrow already released for influencer";
    },
    {
      code: 6004;
      name: "BadTargetStateForEscrow";
      msg: "Bad Target State for Escrow (1) for cancel, (2) for release";
    },
    {
      code: 6005;
      name: "MissmatchBusiness";
      msg: "Missmatch business public key";
    },
    {
      code: 6006;
      name: "MissmatchInfluencer";
      msg: "Missmatch influencer publick key";
    },
    {
      code: 6007;
      name: "BadEscrowState";
      msg: "Bad Escrow State";
    },
    {
      code: 6008;
      name: "MissmatchAuthority";
      msg: "Missmatch Authority";
    },
    {
      code: 6009;
      name: "PercentageFeeOutOfrange";
      msg: "Percengate Fee Out of Range";
    },
    {
      code: 6010;
      name: "NumericalProblemFoundCalculatingFees";
      msg: "Numerical Problem Found Calculating Fees";
    },
    {
      code: 6011;
      name: "BusinessHasInsufficientAmountOfTokens";
      msg: "Busines Has Insufficient Amount Of Tokens";
    },
    {
      code: 6012;
      name: "MissmatchBusinessTokenAccount";
      msg: "Missmatch Business Token Account";
    },
    {
      code: 6013;
      name: "MissmatchInfluencerTokenAccount";
      msg: "Missmatch Influencer Token Account";
    },
    {
      code: 6014;
      name: "MissmatchOrderCode";
      msg: "Missmatch Order Code";
    }
  ];
};
