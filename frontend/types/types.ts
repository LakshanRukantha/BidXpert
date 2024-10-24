export type RegistrationInputs = {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type SignInInputs = {
  email: string;
  password: string;
};

export type AuctionInputs = {
  title: string;
  category: string;
  image: string | FileList;
  description: string;
  price: number;
  end_date: Date;
};
