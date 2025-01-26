import { useState, useEffect } from 'react';

export const useAccountApi = () => {
  const [accountApi, setAccountApi] = useState<string>('');
  const [accountLikedSongs, setAccountLikedSongs] = useState([])
  const [accountPlaylists, setAccountPlaylists] = useState([])
  const [accountName, setAccountName] = useState<string>("")
  const [accountDescription, setAccountDescription] = useState<string | null | undefined>()
  const [password, setPassword] = useState<string>("")

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
        console.log(data);

        setAccountApi(data.account.api_key);
        setAccountLikedSongs(data.likedSongs);
        setAccountPlaylists(data.playlists);
        setAccountName(data.account.name)
        setAccountDescription(data.account.description)
        setPassword(data.account.password)
        sessionStorage.setItem('account_api', accountApi);
        sessionStorage.setItem('calls_left', '10000');
        sessionStorage.setItem('account_playlists', JSON.stringify(accountPlaylists))
        sessionStorage.setItem('account_likedSongs', JSON.stringify(accountLikedSongs))
        sessionStorage.setItem('account_name', accountName)
        sessionStorage.setItem('account_description', accountDescription || "")
        sessionStorage.setItem('password', password)

      } catch (err) {
        console.log(err);
      }
    }
    if (!sessionStorage.getItem('account_api')) fetchAccountData()
  }, [accountApi])
  return accountApi
};

export default useAccountApi;
