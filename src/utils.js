import { api } from "./index";
import history from "./history";
import store from "./store";
import { del } from "automate-redux";

export const logout = () => {
  history.push("/");
  api.setToken(undefined);
  store.dispatch(del("user"));
  store.dispatch(del("devices"));
  store.dispatch(del("token"));
};
