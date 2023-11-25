function createQueryUrl(params: Param[] = []): string {
  const validParams = params.filter((p) => p.value !== undefined);
  if (validParams.length > 0) {
    const queryString = validParams
      .map(
        (p) =>
          `${encodeURIComponent(p.key)}=${encodeURIComponent(
            p.value as string | number
          )}`
      )
      .join("&");
    return `?${queryString}`;
  }
  return "";
}

export { createQueryUrl };
