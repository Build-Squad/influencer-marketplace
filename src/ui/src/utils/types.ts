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
  country: CountryType;
};

type LanguageType = {
  id: string;
  langCode: string;
  langEnglishName: string;
  langNativeName: string;
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