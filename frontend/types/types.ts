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
  image: string;
  description: string;
  price: number;
  end_date: Date;
};

export type AuctionMailParameters = {
  auctionListerName: string;
  auctionListerEmail: string;
  bidderName: string;
  bidderEmail: string;
  itemId: number;
  itemName: string;
  bidAmount: number;
  expiresOn: Date;
};

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type AuctionItemProps = {
  auction_id: number;
  name: string;
  description: string;
  end_date: string;
  start_bid: number;
  high_bid: number;
  image_url: string;
  listed_on: string;
  status: string;
  lister_id: number;
  category_id: number;
  listerName: string;
  categoryName: string;
};

export type CheckoutFormProps = {
  transactionProps: {
    title: string;
    amount: number;
    date: Date;
  };
};

export type CategoryProps = {
  category_id: number;
  name: string;
  value: string;
};
