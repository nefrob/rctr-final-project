import Web3 from "web3";

const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        window.web3 = web3;
        return web3;
    } else {
        alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return null;
    }
};

export default getWeb3;
