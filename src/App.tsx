import { useEffect, useState } from 'react';
import { magic } from './magic';
import './App.css';

function App() {
  const [publicAddress, setPublicAddress] = useState('');

  useEffect(() => {
    magic.rpcProvider.on('accountsChanged', (accounts: string[]) => {
      console.log('accountsChanged', accounts);
      // accountsChanged fires if user disconnects wallet
      accounts[0] ? setPublicAddress(accounts[0]) : logout();
    });
    magic.rpcProvider.on('chainChanged', (chainId: number) => {
      console.log('chainChanged', chainId);
    });
    return () => {
      magic.rpcProvider.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    magic.user.isLoggedIn().then((isLoggedIn: boolean) => {
      console.log('isLoggedIn', isLoggedIn);
      if (isLoggedIn) getInfo();
    });
  }, []);


  const getInfo = () => {
    magic.user
    .getInfo()
    .then((metadata: any) => {
      console.log('user info', metadata);
      setPublicAddress(metadata.publicAddress);
    })
    .catch((e: any) => console.error(e));
  }

  const login = (autoPrompt: boolean) => {
    magic.wallet
      .connectWithUI({ autoPromptThirdPartyWallets: autoPrompt })
      .on('id-token-created', ({ idToken }: { idToken: string}) => {
        console.log('did token', idToken);
      })
      .then((user: string[]) => {
        console.log('user', user);
        setPublicAddress(user[0]);
      })
      .catch(console.log);
  };

  const logout = () => magic.user.logout().then(() => setPublicAddress(''));



  const handleNftCheckout = async () => {
    await magic.nft.checkout({
      contractId: '44d5724e-1bfc-494b-9850-82850eef782d',
      tokenId: '0',
      name: 'Forbes Legacy Pass Test 8',
      imageUrl: 'https://i.seadn.io/s/raw/files/5428206b73fd06c3bd15257ed67be95f.jpg',
      quantity: 1,
      walletAddress: publicAddress,
    })
  }

  return (
    <div className="App">
      {!publicAddress ? (
        <div className="container">
          <h1>Please sign up or login</h1>
          <button onClick={() => login(false)}>Login / Sign up</button>
          <button onClick={() => login(true)}>Login / Sign up (auto prompt 3pw)</button>
        </div>
      ) : (
        <div>
          <div className="container">
            <h1>Current User</h1>
            <div className="info">{publicAddress}</div>
            <button onClick={logout}>Logout</button>
          </div>
          <div className="container">
            <h1>NFT Checkout</h1>
            <button onClick={handleNftCheckout}>Execute</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
