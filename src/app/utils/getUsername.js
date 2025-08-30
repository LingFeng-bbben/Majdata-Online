import useSWR from "swr";
import { apiroot3 } from "../apiroot";

export default function getUsername() {
  const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
      res.json()
    );
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/info/",
    fetcher,
  );
  if (error) {
    return undefined;
  }
  if (isLoading) return "";
  return data.Username;
}
