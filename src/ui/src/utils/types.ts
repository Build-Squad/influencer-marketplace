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
  influencer: string;
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

type OrderItemType = {
  service: ServiceType;
  orderItemMetaData: ServiceMasterMetaDataType[];
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