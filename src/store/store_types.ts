import { Clients, User } from "./datacue_types";

export interface rootState {
  apikey: string;
  clients: Clients;
  user: User;
  nextPage: string | null;
}
