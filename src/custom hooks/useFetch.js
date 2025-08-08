import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

​
export const dataExtractor = data => {
  if (data) {
    if (data?.data) {
      return data?.data;
    }
    return data?.data;
  }
  return data?.data;
};
​
const useFetch = ({
  name = '',
  service,
  conditionalRefetch,
  id,
  props = {},
  params = {},
  dataOnly,
  condition = true,
  pagination,
  onSuccess,
  keepPreviousData = false,
}) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
​
  useEffect(() => {
    if (!pagination) return;
    setPage(0);
    setLimit(10);
  }, [pagination]);
​
  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);
​
  if (pagination) {
    conditionalRefetch = [...conditionalRefetch, page];
  }
​
  params = {
    ...(pagination ? {page: page || 0, pageSize: limit || '10'} : {}),
    ...params,
  };
  let {isLoading, refetch, data, error, isSuccess, isRefetching} = useQuery(
    [name, conditionalRefetch],
    async () => service({id, params, ...props}),
    {
      enabled: condition || !!page,
      keepPreviousData,
      retry: 6,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
    },
  );
​
  data = dataExtractor(data);
​
  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess(data);
  }, [isSuccess]);
​
  if (dataOnly) return data;
​
​
  return {
    isLoading,
    refetch,
    data: dataExtractor(data),
    error,
    isSuccess,
    isRefetching,
    nextPage,
    prevPage,
    page,
    setPage,
  };
};
​
export default useFetch;