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
    magic.user.isLoggedIn().then((res: boolean) => console.log('isLoggedIn', res));
  }

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

  const handlePersonalSign = async () => {
    const originalMessage = 'YOUR_MESSAGE';
    const signedMessage = await web3.eth.personal.sign(originalMessage, web3.utils.toChecksumAddress(publicAddress), '');
    console.log('signedMessage', signedMessage);
  };

  const handleNftCheckout = async () => {
    await magic.nft.checkout({
      contractId: '9e04ce1a-cdee-48a8-bb4b-914c6b416345',
      tokenId: '0',
      name: 'Asset 3',
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
