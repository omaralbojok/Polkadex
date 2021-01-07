const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

// Substrate connection config
const WEB_SOCKET = 'ws://localhost:9944';
const TYPES = {};

// This script will wait for n secs before stopping itself
const LASTING_SECS = 30;

const ALICE = '//Alice';
const BOB = '//Bob';
// This is sending txs / sec, the least is 1 tx/s
const TX_FREQUENCY = 200;

// This is 100 Unit
const TX_AMT = 100000000000000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectSubstrate = async () => {
  const wsProvider = new WsProvider(WEB_SOCKET);
  const api = await ApiPromise.create({
    types: {
        "OrderType": {
            "_enum": [
                "BidLimit",
                "BidMarket",
                "AskLimit",
                "AskMarket"
            ]
        },
        "Order": {
            "id": "Hash",
            "trading_pair": "Hash",
            "trader": "AccountId",
            "price": "FixedU128",
            "quantity": "FixedU128",
            "order_type": "OrderType"
        },
        "Order4RPC": {
            "id": "[u8;32]",
            "trading_pair": "[u8;32]",
            "trader": "[u8;32]",
            "price": "Vec<u8>",
            "quantity": "Vec<u8>",
            "order_type": "OrderType"
        },
        "MarketData": {
            "low": "FixedU128",
            "high": "FixedU128",
            "volume": "FixedU128",
            "open": "FixedU128",
            "close": "FixedU128"
        },
        "LinkedPriceLevel": {
            "next": "Option<FixedU128>",
            "prev": "Option<FixedU128>",
            "orders": "Vec<Order>"
        },
        "LinkedPriceLevelRpc": {
            "next": "Vec<u8>",
            "prev": "Vec<u8>",
            "orders": "Vec<Order4RPC>"
        },
        "Orderbook": {
            "trading_pair": "Hash",
            "base_asset_id": "u32",
            "quote_asset_id": "u32",
            "best_bid_price": "FixedU128",
            "best_ask_price": "FixedU128"
        },
        "OrderbookRPC": {
            "trading_pair": "[u8;32]",
            "base_asset_id": "u32",
            "quote_asset_id": "u32",
            "best_bid_price": "Vec<u8>",
            "best_ask_price": "Vec<u8>"
        },
        "OrderbookUpdates": {
            "bids": "Vec<FrontendPricelevel>",
            "asks": "Vec<FrontendPricelevel>"
        },
        "FrontendPricelevel": {
            "price": "FixedU128",
            "quantity": "FixedU128"
        },
        "LookupSource": "AccountId",
        "Address": "AccountId"
    },
    rpc: {
        polkadex: {
            getAllOrderbook: {
                description: " Blah",
                params: [],
                type: "Vec<OrderbookRpc>"
            },
            getAskLevel: {
                description: " Blah",
                params: [
                    {
                        name: "trading_pair",
                        type: "Hash"
                    }
                ],
                type: "Vec<FixedU128>"
            },
            getBidLevel: {
                description: " Blah",
                params: [
                    {
                        name: "trading_pair",
                        type: "Hash"
                    }
                ],
                type: "Vec<FixedU128>"
            },
            getMarketInfo: {
                description: " Blah",
                params: [
                    {
                        name: "trading_pair",
                        type: "Hash"
                    },
                    {
                        name: "blocknum",
                        type: "u32"
                    }
                ],
                type: "MarketDataRpc"
            },
            getOrderbook: {
                description: " Blah",
                params: [
                    {
                        name: "trading_pair",
                        type: "Hash"
                    }
                ],
                type: "OrderbookRpc"
            },
            getOrderbookUpdates: {
                description: "Gets best 10 bids & asks",
                params: [
                    {
                        name: "at",
                        type: "Hash"
                    },
                    {
                        name: "trading_pair",
                        type: "Hash"
                    }
                ],
                type: "OrderbookUpdates"
            },
            getPriceLevel: {
                description: " Blah",
                params: [
                    {
                        name: "trading_pair",
                        type: "Hash"
                    }
                ],
                type: "Vec<LinkedPriceLevelRpc>"
            },
        }
    },
    provider: wsProvider
});
  return api;
};

// This function returns a tx unsubcription handler
const submitTx = async (api, src, dest, amt, txCnt, nonce) =>
	await api.tx.balances.transfer(dest.address, amt)
		.signAndSend(src, { nonce }, res => {
			console.log(`Tx ${txCnt} status: ${res.status}`);
		});

const main = async () => {
	const api = await connectSubstrate();
	const keyring = new Keyring({ type: 'sr25519' });
	console.log('Connected to Substrate');

	let txCnt = 0;
	let nonce = 0;
	const alice = keyring.addFromUri(ALICE);
	const bob = keyring.addFromUri(BOB);

	setInterval(() => {
		txCnt += 1;
		submitTx(api, alice, bob, TX_AMT, txCnt, nonce);
		nonce += 1;
	}, 1000/TX_FREQUENCY);

       //await sleep(LASTING_SECS * 1000); Original Value
	await sleep(LASTING_SECS * 1000000);
};

main()
	.then(() => {
		console.log("successfully exited");
		process.exit(0);
	})
	.catch(err => {
		console.log('error occur:', err);
		process.exit(1);
	})
