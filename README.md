# Sandman Swap

## Project Description

A [Uniswap V1](https://github.com/Uniswap/uniswap-v1) clone for decentralized token exchange via automated market maker on Ethereum. React frontent links to smart contracts on the local Ethereum blockchain to allow for providing/removing liquidity and swapping `ETH`/tokens via browser wallet.

This project was completed to gain an understanding in writing/testing/deploying smart contracts, and interacting with them from a DApp. The frontent is not intended to be fully functional but rather to provide minimal functionality to allow for usage of the smart contracts.

## Setup

-   Clone the project:

    ```
    git clone hhttps://github.com/nefrob/sandman-swap && cd sandman-swap
    ```

-   Install smart contract dependencies:

    ```
    npm install
    ```

-   Run blockchain: (initializes two accounts with `5000 ETH` each):

    ```
    npm run ganache
    ```

    It is convienent to run the local blockchain deterministically for testing. To do so use:

    ```
    npm run ganache-det
    ```

-   With `ganache` running, you can compile and deploy the contracts with:

    ```
    npm run migrate
    ```

-   Setup and run the React Dapp from the `client` directory:

    ```
    cd client
    npm install
    npm start
    ```

-   Note: MetaMask `ganache` account will need to be reset every time `ganache` is restarted to clear the old test transaction history.

## Test

Unit tests are currently written for the smart contracts in this project (not the frontend components).

To run the tests from the project root directory do: `npm test`.

## Design

#### MVP

-   ~~Home page~~
-   ~~Swap page~~
-   ~~Liquidity pool page~~
-   ~~Wallet page with currennt ETH balance and a button to connect to a wallet~~

#### PostMVP

-   ~~ETH/token exchange prices in USD (use API)~~
-   ~~Integration with MetaMask~~
-   ~~Add new token to wallet functionality~~
-   Integration with Ethereum testnet
    -   Setup frontend on CodeSandBox

#### Initial Wireframes

-   `/home`:

    <img src="design/WireframeHome.png" alt="Home" width="550px" />

-   `/wallet`:

    <img src="design/WireFrameWallet.png" alt="Wallet" width="550px" />

    ([Uniswap V1](https://app.uniswap.org/#/swap) page for reference)

#### Components

| Component  |                                 Description                                 |
| ---------- | :-------------------------------------------------------------------------: |
| App        |                       Page routing, user state setup                        |
| Home       |                       Landing page with project info                        |
| Navigation |                        Page routing, display header                         |
| Swap       |                    Swapping eth/tokens for active pools                     |
| LP         |                            Add/remove liquidity                             |
| Wallet     | Setup MetaMask connection, display current holdings, add tokens to MetaMask |

#### Sandman

This project is themed around Dream of the Endless (aka Sandman) for fun!

## Resources

#### Dependencies

-   `web3.js` for interaction with ethereum nodes.
-   `truffle` for testing and deployment of contracts.
-   `ganache` for local Ethereum blockchain testing.
-   `@openzeppelin/contracts` for ERC standards and smart contract libraries.
-   `react-boostrap` for styling.

#### Browser Wallet

MetaMask is a browser extension that allows you to interact with the Ethereum blockchain on decentralized applications. See [MetaMask Docs](https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider) for more information.

#### API

To make swap prices easier to understand, the current `ETH` value in `USD` will be fetched from [CEX Rest API](https://cex.io/rest-api).

Example request: `https://cex.io/api/last_price/ETH/USD` returns:

```
{
  "lprice": "3400.36",
  "curr1": "ETH",
  "curr2": "USD"
}
```

## Questions?

-   Post issues in the [Issue Tracker](https://github.com/jkeohan/rctr-final-project/issues).
