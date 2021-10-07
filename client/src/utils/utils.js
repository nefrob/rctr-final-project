import Web3 from "web3";

export const getWeb3 = async () => {
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

export const getContract = async (contractJson, addr = null) => {
    try {
        const networkId = await window.web3.eth.net.getId();
        const deployedNetwork = contractJson.networks[networkId];
        const address = addr === null ? deployedNetwork.address : addr;
        const instance = new window.web3.eth.Contract(
            contractJson.abi,
            deployedNetwork && address
        );

        return instance;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const toWei = (eth) => window.web3.utils.toWei(eth.toString());

export const fromWei = (wei) => window.web3.utils.fromWei(wei);
