import { AuctionInputs } from "@/types/types";
import * as yup from "yup";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const auctionValidationSchema = yup.object<AuctionInputs>().shape({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  image: yup
    .mixed<string | FileList>() // Allow only FileList
    .nullable()
    .required("A file is required")
    .test(
      "fileType",
      "Unsupported file type or missing required file",
      (value) => {
        // Validate only if it's a FileList and has files
        if (value && value.length > 0) {
          return (
            value[0] instanceof File &&
            ACCEPTED_FILE_TYPES.includes(value[0].type)
          ); // Validate file type for FileList
        }
        return false; // Invalid if it's not a FileList or empty
      }
    )
    .test("fileSize", "File size is too large", (value) => {
      // Validate only if it's a FileList and has files
      if (value && value.length > 0) {
        return value[0] instanceof File && value[0].size <= MAX_FILE_SIZE; // Validate file size for FileList
      }
      return true; // Skip check if value is not a FileList or empty
    }),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0.01, "Price must be greater than zero"),
  end_date: yup.date().required("End date is required"),
});

export default auctionValidationSchema;
