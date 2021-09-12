# Simple Swap

## Project Description

A [Uniswap V1](https://github.com/Uniswap/uniswap-v1) clone for decentralized automated token exchange on Ethereum. React frontent links to smart contracts on the Ethereum blockchain to allow for providing liquidity and swapping `ETH`/tokens.

<!-- Use this section to describe your final project and perhaps any links to relevant sites that help convey the concept and\or functionality. -->

TODO: [CodeSandbox Link]() to be added for frontend when completed.

## Setup

TODO: update as project proceeds.

Clone the project:

```
git clone https://github.com/nefrob/rctr-final-project.git
cd rctr-final-project
```

Install dependencies:

```
npm install -g truffle
npm install -g ganache-cli
```

Run blockchain (initializes accounts with `100 ETH`):

```
ganache-cli
```

Deploy contracts (in a new terminal):

```
truffle compile --all
truffle migrate --reset
```

Run React Dapp:

```
cd client
npm install
npm start
```

## Design

#### Wireframes

- `/home`:

  <img src="design/WireframeHome.png" alt="Home" width="550px" />

- `/wallet`:

  <img src="design/WireframeWallet.png" alt="Wallet" width="550px" />

[Uniswap V1](https://app.uniswap.org/#/swap) page for reference.

#### Components

TODO: expand as app progresses.

| Component |                  Description                   |
| --------- | :--------------------------------------------: |
| App       |                     Setup                      |
| Header    |                 Render header                  |
| Footer    |   Render potential footer (with references?)   |
| Swap      |           Allow for swapping tokens            |
| LP        |         Allow for add/remove liquidity         |
| Wallet    |            Display current holdings            |
| Account   | Allow for account adding (i.e. wallet connect) |

#### MVP

- Home page with swap and liquidity pool options.
- Wallet page with currennt ETH balance and a button to connect to a wallet.
- Account page with a drop down for account (wallet) switch.

#### PostMVP

- Exchange page with current ETH/token exchange prices.
- Add new token functionality.
- Integration with Ethereum testnet.
- Integration with Codesandbox.
- Integration with MetaMask?

## API

To make swap prices easier to understand, the current `ETH` value in `USD` will be fetched from [CEX Rest API](https://cex.io/rest-api).

Example request: `https://cex.io/api/last_price/ETH/USD` returns:

```
{
  "lprice": "3400.36",
  "curr1": "ETH",
  "curr2": "USD"
}
```

## Additional Libraries

TODO: `redux`/`bootstrap` in the future?

- `web3.js` for interaction with ethereum nodes.
- `truffle` for testing and deployment of contracts.
- `ganache` for local Ethereum blockchain testing.
- `@openzeppelin/contracts` for ERC standards and smart contract libraries.

## Other

#### Code Snippet

TODO: Add code snippet when done.

Use this section to include a brief code snippet of functionality that you are proud of an a brief description. Code snippet should not be greater than 10 lines of code.

```
function reverse(string) {
	// here is the code to reverse a string of text
}
```
