import { object, number, string, array } from "yup";

interface BannerFilterType {
  language: LanguageType | null;
  serviceType: ServiceMasterType | null;
  category: CategoryMasterType | null;
  upperPriceLimit: number | null;
  lowerPriceLimit: number | null;
  upperFollowerLimit: number | null;
  lowerFollowerLimit: number | null;
  searchString: string;
}

const BannerFilterSchema = object({
  upperPriceLimit: number().nullable(),
  lowerPriceLimit: number().nullable(),
  upperFollowerLimit: number().nullable(),
  lowerFollowerLimit: number().nullable(),
  searchString: string(),
});

const BannerFilterInitialValues: BannerFilterType = {
  language: null,
  serviceType: null,
  category: null,
  upperPriceLimit: 100,
  lowerPriceLimit: 0,
  upperFollowerLimit: 50000,
  lowerFollowerLimit: 0,
  searchString: "",
};

export { BannerFilterSchema, BannerFilterInitialValues };
