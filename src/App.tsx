import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { magic } from './magic';
import './App.css';

function App() {
  const [publicAddress, setPublicAddress] = useState('');
  const web3 = new Web3(magic.rpcProvider);

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

  const isLoggedIn = () => {
    magic.user.isLoggedIn().then((res) => console.log('isLoggedIn', res));
  }

  const getInfo = () => {
    magic.user
    .getInfo()
    .then((metadata: any) => {
      console.log('user info', metadata);
      setPublicAddress(metadata.publicAddress);
    })
    .catch(e => console.error(e));
  }

  const login = () => {
    magic.wallet
      .connectWithUI()
      .on('id-token-created', ({ idToken }) => {
        console.log('did token', idToken);
      })
      .then(user => {
        console.log('user', user);
        setPublicAddress(user[0]);
      })
      .catch(console.log);
  };

  const logout = () => magic.user.logout().then(() => setPublicAddress(''));

  const handlePersonalSign = async () => {
    const originalMessage = 'YOUR_MESSAGE';
    const signedMessage = await web3.eth.personal.sign(originalMessage, publicAddress, '');
    console.log('signedMessage', signedMessage);
  };

  const handleNftCheckout = async () => {
    await magic.nft.checkout({
      contractId: '1e719eaa-990e-41cf-b2e0-a4eb3d5d1312',
      tokenId: '2',
      name: 'Portal',
      imageUrl: 'https://nft-cdn.alchemy.com/matic-mumbai/5d55353a3f95997ce7b33bc08c6832ed',
      quantity: 1,
      walletAddress: publicAddress,
    })
  }

  return (
    <div className="App">
      {!publicAddress ? (
        <div className="container">
          <h1>Please sign up or login</h1>
          <button onClick={login}>Login / Sign up</button>
        </div>
      ) : (
        <div>
          <div className="container">
            <h1>Current User</h1>
            <div className="info">{publicAddress}</div>
            <button onClick={isLoggedIn}>isLoggedIn</button>
            <button onClick={getInfo}>GetUserInfo</button>
            <button onClick={logout}>Logout</button>
          </div>
          <div className="container">
            <h1>Personal Sign</h1>
            <button onClick={handlePersonalSign}>Sign</button>
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
