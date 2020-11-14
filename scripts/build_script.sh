git clone https://github.com/Polkadex-Substrate/Polkadex.git
git checkout frontend-sample-code
curl https://getsubstrate.io -sSf | bash -s -- --fast
# shellcheck disable=SC1090
source ~/.cargo/env
rustup override set nightly-2020-09-28
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-09-28
cargo build --release