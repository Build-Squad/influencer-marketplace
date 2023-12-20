import { object, number, string, ObjectSchema } from "yup";

interface ServiceFormType {
  id?: string | null;
  service_master: string;
  service_masterObject?: ServiceMasterType | null;
  price: number;
  currency: string;
  currencyObject?: CurrencyType | null;
  description: string;
  status: string;
  publish_date?: string | null;
}

export const serviceFormSchema = object({
  id: string().nullable(),
  service_master: string().required("Service master is required"),
  price: number().required("Price is required"),
  currency: string().required("Currency is required"),
  description: string().required("Description is required"),
});

export const serviceFormInitialValues: ServiceFormType = {
  id: null,
  service_master: "",
  price: 0,
  currency: "",
  service_masterObject: null,
  currencyObject: null,
  description: "",
  status: "",
  publish_date: null,
};
