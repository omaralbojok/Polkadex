../target/release/polkadex-mainnet build-spec --disable-default-bootnode --chain local > customSpec.json
../target/release/polkadex-mainnet build-spec --chain=customSpec.json --raw --disable-default-bootnode > customSpecRaw.json
