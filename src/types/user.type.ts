export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  status: string;
  profileImage: string;
  roleId: number;
  Role: { name: string };
}
