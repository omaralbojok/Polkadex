// IMPORTANT NOTE
// This is a simple tutorial that shows how to retrieve market data from Polkadex nodes in real time
// These data can be used to do technical analysis off-chain and place trades accordingly.
// The given example uses trades from ETH/BTC market of Binance Public API to simulate trades. Binance API was not chosen on
// endorse them but only as an example, It should only be treated as a quick and dirty solution to simulate real trades.

// Polkadex team is not associated with Binance in any way.

// Import
const {ApiPromise, WsProvider} = require('@polkadot/api');

const wsProvider = new WsProvider('ws://localhost:9944');
polkadex_market_data().then();


async function polkadex_market_data() {


    const api = await ApiPromise.create({
        provider: wsProvider,
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
            "Orderbook": {
                "trading_pair": "Hash",
                "base_asset_id": "u32",
                "quote_asset_id": "u32",
                "best_bid_price": "FixedU128",
                "best_ask_price": "FixedU128"
            },
            "LookupSource": "AccountId",
            "Address": "AccountId"
        },
    });


    const tradingPairID = "0xf28a3c76161b8d5723b6b8b092695f418037c747faa2ad8bc33d8871f720aac9";
    const FixedU128_denominator = 1000000000000000000;

    const GenesisTime = Date.parse('09 Nov 2020 00:00:00 GMT');
    const blockPeriod = 3;
    // Now there are some trades executing in the system so now let's listen for market data updates from Polkadex
    api.derive.chain.subscribeNewHeads((header) => {
        api.query.polkadex.marketInfo(tradingPairID, header.number).then(market_data => {
            console.log(` 
                          Date: ${GenesisTime + (header.number)*blockPeriod}
                          Low: ${market_data.low / FixedU128_denominator} 
                          High: ${market_data.high / FixedU128_denominator}
                          Volume: ${market_data.volume / FixedU128_denominator}
                          Open: ${market_data.open / FixedU128_denominator}
                          Close: ${market_data.close / FixedU128_denominator}`);
        });
    });

}
