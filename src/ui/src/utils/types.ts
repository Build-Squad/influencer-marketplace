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
  }[];
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
};

type OrderFilterType = {
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

interface SVGIcon
  extends React.FunctionComponent<React.SVGAttributes<HTMLOrSVGElement>> {}

declare module "*.svg?icon" {
  const content: SVGIcon;
  export default content;
}
