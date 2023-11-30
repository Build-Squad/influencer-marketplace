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

type ServiceMasterType = {
  id: string;
  name: string;
  description: string;
  limit: string;
  type: string;
  created_at: string;
  deleted_at: string | null;
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
};
