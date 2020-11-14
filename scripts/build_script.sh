curl https://getsubstrate.io -sSf | bash -s -- --fast
# shellcheck disable=SC1090
source ~/.cargo/env
rustup override set nightly-2020-09-28
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-09-28
cargo build --release