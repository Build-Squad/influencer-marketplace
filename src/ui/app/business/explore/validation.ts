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
  upperPriceLimit: null,
  lowerPriceLimit: null,
  upperFollowerLimit: null,
  lowerFollowerLimit: null,
  searchString: "",
  isVerified: false,
};

export { ExploreFilterSchema, ExploreFilterInitialValues };
