import { object, number, string, ObjectSchema } from "yup";

interface ServiceFormType {
  id?: string | null;
  name: string;
  service_master: string;
  package: string;
  quantity: number;
  price: number;
  currency: string;
  status: string;
}

export const serviceFormSchema: ObjectSchema<ServiceFormType> = object({
  id: string().nullable(),
  name: string().required("Name is required"),
  service_master: string().required("Service master is required"),
  package: string().required("Package is required"),
  quantity: number().required("Quantity is required"),
  price: number().required("Price is required"),
  currency: string().required("Currency is required"),
  status: string().required("Status is required"),
});

export const serviceFormInitialValues: ServiceFormType = {
  id: null,
  name: "",
  service_master: "",
  package: "",
  quantity: 0,
  price: 0,
  currency: "",
  status: "",
};
