import { contact } from "./contact";

export interface schedule {
  pk?: number;
  date: any;
  title: string;
  remark?: string;
  location: string;
  reminder?: any;
  contact?: contact;
}