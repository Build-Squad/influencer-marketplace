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
  rating: number;
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
  rating: 0,
};

export { BannerFilterSchema, BannerFilterInitialValues };
