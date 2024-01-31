import { object, number, string, array } from "yup";

interface BannerFilterType {
  regions: Array<RegionType>;
  serviceTypes: Array<ServiceMasterType>;
  categories: Array<CategoryMasterType>;
  upperPriceLimit: number | null;
  lowerPriceLimit: number | null;
  upperFollowerLimit: number | null;
  lowerFollowerLimit: number | null;
  searchString: string;
  isVerified: boolean;
}

const BannerFilterSchema = object({
  upperPriceLimit: number().nullable(),
  lowerPriceLimit: number().nullable(),
  upperFollowerLimit: number().nullable(),
  lowerFollowerLimit: number().nullable(),
  searchString: string(),
});

const BannerFilterInitialValues: BannerFilterType = {
  regions: [],
  serviceTypes: [],
  categories: [],
  upperPriceLimit: null,
  lowerPriceLimit: null,
  upperFollowerLimit: null,
  lowerFollowerLimit: null,
  searchString: "",
  isVerified: false,
};

export { BannerFilterSchema, BannerFilterInitialValues };
