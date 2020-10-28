#![cfg(feature = "runtime-benchmarks")]

use super::*;
use sp_std::prelude::*;
use frame_system::RawOrigin;
use frame_support::{ensure, traits::OnFinalize,};
use frame_benchmarking::{benchmarks, TrackedStorageKey, account};
use sp_core::H256;
const SEED: u32 = 0;

benchmarks! {
    _ {}
    register_new_orderbook{
        let accountid = account("caller", 0, SEED);

    }:_(RawOrigin::Signed(accountid), 2, 1)
}

