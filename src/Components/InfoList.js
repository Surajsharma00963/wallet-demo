import {useEffect, useState} from 'react'
import {
    useAppKitState,
    useAppKitTheme,
    useAppKitEvents,
    useAppKitAccount,
    useWalletInfo,
    useAppKitProvider,
    useAppKitNetworkCore,

} from '@reown/appkit/react'
import {ethers} from 'ethers';



export const InfoList = ({hash, signedMsg, balance, contract, setContract}) => {
    const [statusTx, setStatusTx] = useState('');

    const {themeMode, themeVariables} = useAppKitTheme();
    const state = useAppKitState();
    const {chainId} = useAppKitNetworkCore();
    const {address, caipAddress, isConnected, embeddedWalletInfo} = useAppKitAccount(); // AppKit hook to get the account information
    const events = useAppKitEvents()
    const walletInfo = useWalletInfo()
    const {walletProvider} = useAppKitProvider('eip155')

    useEffect(() => {
        console.log("Events: ", events);
    }, [events]);


    useEffect(() => {
        const checkTransactionStatus = async () => {
            if (hash && walletProvider) {
                try {
                    const provider = new ethers.providers.Web3Provider(walletProvider);
                    const receipt = await provider.getTransactionReceipt(hash)
                    setStatusTx(receipt?.status === 1 ? 'Success' : receipt?.status === 0 ? 'Failed' : 'Pending')
                } catch (err) {
                    console.error('Error checking transaction status:', err)
                    setStatusTx('Error')
                }
            }
        }

        checkTransactionStatus()
    }, [hash, walletProvider])
    console.log(contract)
    return (
        isConnected &&
        <div className="container-fluid py-3 mx-0 px-0">
            {balance && (
                <div className="card p-3 mb-3">
                    <h2 className="card-title text-start">Balance</h2>
                    <p className="card-text text-start">{balance}</p>
                </div>
            )}
            {contract?.balance && (
                <div className="card p-3 mb-3">
                    <h2 className="card-title text-start">Contract Balance</h2>
                    <p className="card-text text-start">{contract?.balance} {contract.symbol}</p>
                </div>
            )}
            {contract !== null && (
                <div className="card p-3 mb-3">
                    <div className='d-flex align-items-center justify-content-between mb-3'>
                        <h2 className="card-title text-start">Contract</h2>
                        <button onClick={() => {
                            setContract(null)
                        }} className='m-0 p-0 btn'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </button>
                    </div>
                    <pre className="card-text text-start">
                        Token Name: {contract.name}<br />
                        Address: {contract.address}<br />
                        Token Decimals: {contract.decimals}<br />


                    </pre>
                </div>
            )
            }
            {
                chainId && isConnected && (
                    <div className="card p-3 mb-3">
                        <h2 className="card-title text-start">Chain Id</h2>
                        <p className="card-text text-start">{chainId}</p>
                    </div>
                )
            }

            {
                hash && (
                    <div className="card p-3 mb-3">
                        <h2 className="card-title text-left">Sign Tx</h2>
                        <pre className="card-text text-start">
                            Hash: {hash}<br />
                            Status: {statusTx}
                        </pre>
                    </div>
                )
            }

            {
                signedMsg && (
                    <div className="card p-3 mb-3">
                        <h2 className="card-title text-start">Sign msg</h2>
                        <pre className="card-text text-start">
                            signedMsg: {signedMsg}
                        </pre>
                    </div>
                )
            }

            <div className="card p-3 mb-3 w-100">
                <h2 className="card-title text-start">useAppKit</h2>
                <pre className="card-text text-start">
                    Address: {address}<br />
                    caip Address: {caipAddress}<br />
                    Connected: {isConnected.toString()}<br />
                    Account Type: {embeddedWalletInfo?.accountType}<br />
                    {embeddedWalletInfo?.user?.email && (`Email: ${embeddedWalletInfo?.user?.email}\n`)}
                    {embeddedWalletInfo?.user?.username && (`Username: ${embeddedWalletInfo?.user?.username}\n`)}
                    {embeddedWalletInfo?.authProvider && (`Provider: ${embeddedWalletInfo?.authProvider}\n`)}
                </pre>
            </div>

            <div className="card p-3 mb-3">
                <h2 className="card-title text-start">Theme</h2>
                <pre className="card-text text-start">
                    Theme: {themeMode}<br />
                    ThemeVariables: {JSON.stringify(themeVariables, null, 2)}
                </pre>
            </div>

            <div className="card p-3 mb-3">
                <h2 className="card-title text-start">State</h2>
                <pre className="card-text text-start">
                    activeChain: {state.activeChain}<br />
                    loading: {state.loading.toString()}<br />
                    open: {state.open.toString()}<br />
                    selectedNetworkId: {state.selectedNetworkId?.toString()}
                </pre>
            </div>

            <div className="card p-3 mb-3">
                <h2 className="card-title text-start">Wallet Info</h2>
                <pre className="card-text text-start">
                    Name: {walletInfo.walletInfo?.name?.toString()}
                </pre>
            </div>
        </div >

    )
}
