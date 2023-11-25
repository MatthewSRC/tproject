type Param = {
  key: string;
  value: string | number | undefined;
};

type FetchResponse = {
  status: "success" | "empty" | "error";
  payload?: Object | string | ArrayBuffer;
};
