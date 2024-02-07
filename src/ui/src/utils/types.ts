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
  country: CountryType | null;
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
  order_id?: string;
  order_item_meta_data: OrderItemMetaDataType[];
  publish_date?: string;
  published_tweet_id?: string;
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

type OrderType = {
  id?: string;
  buyer?: UserType;
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

interface SVGIcon
  extends React.FunctionComponent<React.SVGAttributes<HTMLOrSVGElement>> {}

declare module "*.svg?icon" {
  const content: SVGIcon;
  export default content;
}

type Xfluencer = {
  "version": "0.1.0",
  "name": "xfluencer",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "judge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sellerReceiveTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createEscrow",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimEscrow",
      "accounts": [
        {
          "name": "influencer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyerKey",
            "type": "publicKey"
          },
          {
            "name": "buyerDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "sellerKey",
            "type": "publicKey"
          },
          {
            "name": "sellerReceiveTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "judgeKey",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "orderCode",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "status\n        0: New\n        1: Shipping\n        2: Delivered"
            ],
            "type": "u8"
          },
          {
            "name": "deliveryTime",
            "type": "i64"
          },
          {
            "name": "trialDay",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "escrowAccountSolana",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "type": "publicKey"
          },
          {
            "name": "to",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};