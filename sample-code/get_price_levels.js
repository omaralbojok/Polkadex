



// IMPORTANT NOTE
// This is a simple tutorial that shows how to retrieve market data from Polkadex nodes in real time
// These data can be used to do technical analysis off-chain and place trades accordingly.
// The given example uses trades from ETH/BTC market of Binance Public API to simulate trades. Binance API was not chosen on
// endorse them but only as an example, It should only be treated as a quick and dirty solution to simulate real trades.

// Polkadex team is not associated with Binance in any way.

// Import
const {ApiPromise, WsProvider} = require('@polkadot/api');

const wsProvider = new WsProvider('ws://0.0.0.0:9944');
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
            "Order4RPC": {
                "id": "Hash",
                "trading_pair": "Hash",
                "trader": "Hash",
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
                "next": "<Vec<u8>",
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
            "OrderbookRpc": {
                "trading_pair": "Hash",
                "base_asset_id": "u32",
                "quote_asset_id": "u32",
                "best_bid_price": "Vec<u8>",
                "best_ask_price": "Vec<u8>"
            },
            "LookupSource": "AccountId",
            "Address": "AccountId"
        },
    });

    const FixedU128_denominator = 1000000000000000000;
    const tradingPairID = "0xf28a3c76161b8d5723b6b8b092695f418037c747faa2ad8bc33d8871f720aac9";
    api.derive.chain.subscribeNewHeads((header) => {
        let best_bid;
        let best_ask;
        api.query.polkadex.orderbooks(tradingPairID).then((orderbook) => {
            best_bid = (orderbook.best_bid_price/FixedU128_denominator);
            best_ask = (orderbook.best_ask_price/FixedU128_denominator);
            // console.log(`Best Bid ${best_bid}`);
            // console.log(`Best Ask ${best_ask}`);
        })
        api.query.polkadex.priceLevels.entries(tradingPairID).then((levels) => {
            // console.log(levels.toString())
            levels.forEach(([key, level]) => {
                console.log('     Price:', parseFloat(key.toHuman()[1].replace(/,/g, ''))/FixedU128_denominator); // TODO: @Rudar there is something we need to do with best_bid and best_ask, I wil explain it on call.
                console.log('     level:', level.orders.toHuman()); // TODO: @Rudar loop through the each order and add up the quantity.
            });
        })
    });
}
