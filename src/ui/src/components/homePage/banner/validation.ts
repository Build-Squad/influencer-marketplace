import { object, number, string, array } from "yup";

interface BannerFilterType {
  language?: [string] | [];
  serviceType: [string] | [];
  category: [string] | [];
  upperPriceLimit: number | null;
  lowerPriceLimit: number | null;
  upperFollowerLimit: number | null;
  lowerFollowerLimit: number | null;
}

const BannerFilterSchema = object({
  language: array().of(string()),
  serviceType: array().of(string()),
  category: array().of(string()),
  upperPriceLimit: number().nullable(),
  lowerPriceLimit: number().nullable(),
  upperFollowerLimit: number().nullable(),
  lowerFollowerLimit: number().nullable(),
});

const BannerFilterInitialValues: BannerFilterType = {
  language: [],
  serviceType: [],
  category: [],
  upperPriceLimit: 100,
  lowerPriceLimit: 0,
  upperFollowerLimit: 50000,
  lowerFollowerLimit: 0,
};

export { BannerFilterSchema, BannerFilterInitialValues };
