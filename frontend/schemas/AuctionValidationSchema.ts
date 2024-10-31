import { AuctionInputs } from "@/types/types";
import * as yup from "yup";

const auctionValidationSchema = yup.object<AuctionInputs>().shape({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  image: yup.string().required("Image is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0.01, "Price must be greater than zero"),
  end_date: yup.date().required("End date is required"),
});

export default auctionValidationSchema;
