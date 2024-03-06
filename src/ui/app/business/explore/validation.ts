import { object, number, string } from "yup";

interface ExploreFilterType {
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

const ExploreFilterSchema = object({
  upperPriceLimit: number().nullable(),
  lowerPriceLimit: number().nullable(),
  upperFollowerLimit: number().nullable(),
  lowerFollowerLimit: number().nullable(),
  searchString: string(),
});

const ExploreFilterInitialValues: ExploreFilterType = {
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

export { ExploreFilterSchema, ExploreFilterInitialValues };
