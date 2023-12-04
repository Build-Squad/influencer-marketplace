import { object, number, string, ObjectSchema } from "yup";

interface ServiceFormType {
  id?: string | null;
  service_master: string;
  service_masterObject?: ServiceMasterType | null;
  package: string;
  packageObject?: PackageType | null;
  quantity: number;
  price: number;
  currency: string;
  currencyObject?: CurrencyType | null;
  status: string;
  statusObject?: {
    value: string;
    label: string;
  } | null;
}

export const serviceFormSchema = object({
  id: string().nullable(),
  service_master: string().required("Service master is required"),
  package: string().required("Package is required"),
  quantity: number().required("Quantity is required"),
  price: number().required("Price is required"),
  currency: string().required("Currency is required"),
  status: string().required("Status is required"),
});

export const serviceFormInitialValues: ServiceFormType = {
  id: null,
  service_master: "",
  package: "",
  quantity: 0,
  price: 0,
  currency: "",
  status: "",
  service_masterObject: null,
  packageObject: null,
  currencyObject: null,
  statusObject: null,
};
