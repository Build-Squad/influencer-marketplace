import { object, number, string } from "yup";

interface ExploreFilterType {
  languages: Array<LanguageType>;
  serviceTypes: Array<ServiceMasterType>;
  categories: Array<CategoryMasterType>;
  upperPriceLimit: number | null;
  lowerPriceLimit: number | null;
  upperFollowerLimit: number | null;
  lowerFollowerLimit: number | null;
  searchString: string;
  isVerified: boolean;
}

const ExploreFilterSchema = object({
  upperPriceLimit: number().nullable(),
  lowerPriceLimit: number().nullable(),
  upperFollowerLimit: number().nullable(),
  lowerFollowerLimit: number().nullable(),
  searchString: string(),
});

const ExploreFilterInitialValues: ExploreFilterType = {
  languages: [],
  serviceTypes: [],
  categories: [],
  upperPriceLimit: 100,
  lowerPriceLimit: 0,
  upperFollowerLimit: 50000,
  lowerFollowerLimit: 0,
  searchString: "",
  isVerified: false,
};

export { ExploreFilterSchema, ExploreFilterInitialValues };
