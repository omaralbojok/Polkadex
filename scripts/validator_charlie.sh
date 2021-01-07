../target/release/polkadex-mainnet purge-chain --base-path /tmp/bob --chain local
../target/release/polkadex-mainnet \
  --base-path /tmp/bob \
  --chain customSpecRaw.json \
  --charlie \
  --port 30334 \
  --ws-port 9945 \
  --rpc-port 9934 \
  --validator \
  --node-key 0000000000000000000000000000000000000000000000000000000000000003 \
  --bootnodes /ip4/3.22.114.112/tcp/30333/p2p/12D3KooWSCufgHzV4fCwRijfH2k3abrpAJxTKxEvN1FDuRXA2U9x
