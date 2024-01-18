export type BasicBusinessDetailsType = {
  business_name: string;
  industry: string;
  founded: string;
  headquarters: string;
  bio: string;
  user_email: string;
  phone: string;
  website: string;
  twitter_account: string;
  linked_in: string;
};

export type UserDetailsType = {
  username: string;
  isTwitterAccountConnected: boolean;
  isWalletConnected: boolean;
  businessDetails: BasicBusinessDetailsType;
};

export const BasicBusinessDetailsDefault = {
  business_name: "",
  industry: "",
  founded: "",
  headquarters: "",
  bio: "",
  user_email: "",
  phone: "",
  website: "",
  twitter_account: "",
  linked_in: "",
};
