# Contracts Watcher

Contracts Watcher is a project built on [Remix.run](https://remix.run/) that aims to monitor the state of the Carbonable smart contract on the blockchain. It provides a convenient way to keep track of the contract's activities and ensures its integrity.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [License](#license)

## Getting Started
To use Contracts Watcher and its dependencies, you need [pnpm](https://pnpm.io/). If you haven't installed pnpm globally, you can do so with the following command:

```bash
pnpm install -g pnpm
```

## Installation

```bash
pnpm install
```

## Development

From your terminal:

```sh
pnpm dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to.

## .env
```sh
NETWORK=testnet|mainnet
RPC=https://rpc.nethermind.io/goerli-juno/|https://rpc.nethermind.io/mainnet-juno/|https://rpc.nethermind.io/sepolia-juno/
RPC_API_KEY="your-api-key"
DISPLAY_APR=true|false
IS_PUBLIC=true|false
```

## License
This project is licensed under the Apache 2.0 License. You can find more details in the [LICENSE](/LICENSE) file.
