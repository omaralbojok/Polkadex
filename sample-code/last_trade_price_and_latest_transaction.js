



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

    const FixedU128_denominator = 1000000000000000000;

    api.query.system.events((events) => {
        console.log(`\nReceived ${events.length} events:`);

        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            // Extract the phase, event and the event types
            const { event,phase } = record;
            const types = event.typeDef;

            if((event.section === "polkadex") && (event.method === "FulfilledLimitOrder" || event.method === "PartialFillLimitOrder")){
                console.log(`\t\t\t${types[2].type}: ${event.data[2].toString()}`) // TODO: @Rudar use this as the code for last transaction
                console.log(`\t\t\tPrice: ${event.data[3]/FixedU128_denominator}`) // TODO: @Rudar Use this as the last transaction value
                // TODO: @Rudar if event.data[2].toString() === AskLimit then Red Color, if BidLimit then green color
            }
        });
    });

}
