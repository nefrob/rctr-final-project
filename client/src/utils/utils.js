import Web3 from "web3";

export const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        window.web3 = web3; // fixme: remove
        return web3;
    } else {
        alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return null;
    }
};

export const getContract = async (contractJson, web3) => {
    try {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contractJson.networks[networkId];
        const instance = new web3.eth.Contract(
            contractJson.abi,
            deployedNetwork && deployedNetwork.address
        );

        return instance;
    } catch (error) {
        console.log(error);
        return null;
    }
};
