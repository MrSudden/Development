/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import{ createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();
const { ethereum } = window;

const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum);

    // const accounts = await provider.send('eth_requestAccounts', []);
    // const balance = await provider.getBalance(accounts[0]);
    // console.log({accounts, balance});
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            
            const transactionContract = getEthereumContract();
            const availableTransactions = await (await transactionContract).getFunction("getAllTransactions")();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.from,
                timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: Number(transaction.amount) / (10 ** 18)
            }))
            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if(accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log("No accounts found!");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }   
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await (await transactionContract).getFunction("getTransactionCount")();
            
            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
                
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
                
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI or 0.000021 ETH
                    value: parsedAmount._hex
                }]
            });

            const transactionHash = await (await transactionContract).getFunction("addToBlockchain")(addressTo, parsedAmount, message, keyword);
            
            setIsLoading(true);
            // console.log("Loading - " + transactionHash.hash);
            await transactionHash.wait();
            setIsLoading(false);
            // console.log("Success - " + transactionHash.hash);

            const transactionCount = await (await transactionContract).getFunction("getTransactionCount")();
            setTransactionCount(Number(transactionCount));

            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
      checkIfWalletIsConnected();
      checkIfTransactionsExist();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}
