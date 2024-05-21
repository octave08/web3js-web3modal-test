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
      if (isLoggedIn) {
        magic.user
          .getInfo()
          .then((metadata: any) => {
            console.log('user info', metadata);
            setPublicAddress(metadata.publicAddress);
          })
          .catch(e => console.error(e));
      }
    });
  }, []);

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
            <button onClick={logout}>Logout</button>
          </div>
          <div className="container">
            <h1>Personal Sign</h1>
            <button onClick={handlePersonalSign}>Sign</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
