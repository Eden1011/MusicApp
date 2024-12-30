import { useState, useEffect } from 'react';

export const useAccountApi = () => {
  const [accountApi, setAccountApi] = useState<string>('');

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const account_id = sessionStorage.getItem('account_id');
        if (!account_id) throw new Error('Account ID not found in sessionStorage')

        const response = await fetch(`/api/account?id=${account_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }

        const data = await response.json();
        setAccountApi(data.account.api_key);
        sessionStorage.setItem('account_api', accountApi);
        sessionStorage.setItem('calls_left', '10000');
      } catch (err) {
        console.log(err);
      }
    }
    if (!sessionStorage.getItem('account_api')) fetchAccountData()
  }, [accountApi])
  return accountApi
};

export default useAccountApi;
