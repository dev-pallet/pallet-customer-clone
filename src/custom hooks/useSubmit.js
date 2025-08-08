import {useEffect} from 'react';
import {dataExtractor} from './useFetch';
import {useMutation} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import { setAlertMsg } from '../redux/reducers/miscReducer';

​
export const useSubmit = ({
  service = () => {},
  dataOnly = false,
  id,
  onSuccess,
  successToast = true,
  props = {},
  onError,
  fb,
}) => {
  // const toast = useToast();
  const dispatch = useDispatch();
  let {mutate, isLoading, isSuccess, error, data} = useMutation(data =>
    service({id, data, ...props}),
  );
​
  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess(data);
    if (error && onError) onError(error);
    if (isSuccess && successToast && fb) {
      dispatch(
        setAlertMsg({
          status: 'success',
          message: 'succes',
        }),
      );
    }
  }, [error, isSuccess]);
​
  data = dataExtractor(data);
  if (dataOnly) return data;
​
  return {
    submit: mutate,
    data,
    isLoading,
    isSuccess,
    error,
  };
};