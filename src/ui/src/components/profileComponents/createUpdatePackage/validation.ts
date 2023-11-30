import { object, number, string, ObjectSchema } from "yup";

interface PackageFormType {
  id?: string | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  publish_date: string;
  influencer: string;
}

const packageFormSchema: ObjectSchema<PackageFormType> = object({
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
  status: "",
  publish_date: "",
  influencer: "",
};

export { packageFormSchema, packageFormInitialValues };
