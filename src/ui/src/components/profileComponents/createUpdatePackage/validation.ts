import { FORM_DATE_FORMAT } from "@/src/utils/consts";
import dayjs from "dayjs";
import { object, number, string, ObjectSchema } from "yup";

interface PackageFormType {
  id?: string | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencyObject?: CurrencyType | null;
  status: string;
  statusObject?: ConstSelectType | null;
  publish_date: string;
  influencer: string;
}

const packageFormSchema = object({
  id: string().nullable(),
  name: string().required("Name is required"),
  description: string().required("Description is required"),
  price: number().required("Price is required"),
  currency: string().required("Currency is required"),
  status: string().required("Status is required"),
  publish_date: string().required("Publish date is required"),
  influencer: string().required("Influencer is required"),
});

const packageFormInitialValues: PackageFormType = {
  id: null,
  name: "",
  description: "",
  price: 0,
  currency: "",
  currencyObject: null,
  status: "",
  publish_date: "",
  influencer: "542aea90-5991-49bc-aa4d-002589c00094",
  statusObject: null,
};

export { packageFormSchema, packageFormInitialValues };
