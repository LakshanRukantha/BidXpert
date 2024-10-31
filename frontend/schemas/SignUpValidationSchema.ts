import * as yup from "yup";

const signUpValidationSchema = yup.object().shape({
  f_name: yup.string().required("First name is required"),
  l_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

export default signUpValidationSchema;
