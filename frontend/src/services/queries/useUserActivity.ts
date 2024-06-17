import { useQuery } from "react-query";
import { GetUserActivityResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetUserActivity = qs.stringifyUrl({
    url: `users/activity`,
  });
  const { data } = await axios.get<GetUserActivityResponse>(apiGetUserActivity);
  return data;
};

export default function useUserActivity() {
  return useQuery<GetUserActivityResponse>(["UserActivity"], () =>
    handleRequest()
  );
}
