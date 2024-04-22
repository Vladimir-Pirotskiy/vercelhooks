import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemSlice } from '@ton/core';

export type StblStakingConfig = {
    initialiser: Address,
    jetton_a_minter: Address,
    jetton_b_minter: Address,
    apr: bigint,
    reward_period: bigint,
    max_stake: bigint,
    min_stake: bigint,
    escrow_contract_code: Cell,
    nft_collection_address: Address,
    nft_metadata: Cell
};

export function stblStakingConfigToCell(config: StblStakingConfig): Cell {
    return beginCell()
        .storeInt(0n,1)
        .storeAddress(config.initialiser)
        // .storeAddress(config.jetton_a_minter)
        // .storeAddress(config.jetton_b_minter)
        // .storeCoins(config.reward_amount)
        // .storeUint(config.reward_period,32)
        // .storeRef(config.store_contract_code)
    .endCell();
}

export class StblStaking implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StblStaking(address);
    }

    static createFromConfig(config: StblStakingConfig, code: Cell, workchain = 0) {
        const data = stblStakingConfigToCell(config);
        const init = { code, data };
        return new StblStaking(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, query_id: bigint, config: StblStakingConfig) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xe1, 32)  // op
                .storeUint(query_id, 64)  // query_id
                .storeAddress(config.jetton_a_minter)
                .storeAddress(config.jetton_b_minter)
                .storeUint(config.apr, 32)
                .storeInt(config.reward_period, 256)
                .storeCoins(config.max_stake)
                .storeCoins(config.min_stake)
                .storeRef(config.escrow_contract_code)
                .storeRef(beginCell()
                    .storeAddress(config.nft_collection_address)
                    .storeRef(config.nft_metadata)
                .endCell())
            .endCell(),
        });
    }

    async sendUnstake(provider: ContractProvider, via: Sender,
        opts: {
            query_id: bigint,
            value: bigint, 
            jettonsAmount: bigint,
        }
        ) {
        await provider.internal( via,
            {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                    .storeUint(0xe2, 32)  // op
                    .storeUint(opts.query_id, 64)  // query_id
                    .storeCoins(opts.jettonsAmount)
                    .endCell()
            });
    }

    async sendChangeOwner(provider: ContractProvider, via: Sender,
        value: bigint, 
        query_id: bigint,
        newOwner: string,
        ){
            await provider.internal( via,
                {
                    value: value,
                    sendMode: SendMode.PAY_GAS_SEPARATELY,
                    body: beginCell()
                        .storeUint(0x03, 32)  // op
                        .storeUint(query_id, 64)  // query_id
                        .storeAddress(Address.parse(newOwner))
                        .endCell()
                });

        }

    async getEscrowByStaker(provider: ContractProvider, staker: Address): Promise<Address>{
        const stakerCell: Cell = beginCell().storeAddress(staker).endCell();
        const stakerTupleItem: TupleItemSlice = {
            type: 'slice',
            cell: stakerCell
        };
        const data = await provider.get("get_escrow_by_staker", [stakerTupleItem]);
        const stack = await data.stack;
        let escrow: Address = stack.readAddress();
        return escrow;
    }

    async getNftCollectionAddress(provider: ContractProvider):  Promise<Address> {
        const data = await provider.get("get_nft_collection_address", []);
        const stack = await data.stack;
        let collectionAddress: Address = stack.readAddress();
        return collectionAddress;
    }

    
    async getJettonAddresses(provider: ContractProvider): 
    Promise<{jettonAMinter: Address, jettonAWallet: Address, jettonBMinter: Address, jettonBWallet: Address}> 
    {
        const data = await provider.get("get_jetton_addresses", []);
        const stack = await data.stack;
        let jettonA = stack.readTuple();
        let jettonB = stack.readTuple();

        let jettonAMinter = jettonA.readAddress();
        let jettonAWallet = jettonA.readAddressOpt();

        let jettonBMinter = jettonB.readAddress();
        let jettonBWallet = jettonB.readAddressOpt();

        return {
            jettonAMinter: jettonAMinter,
            jettonAWallet: jettonAWallet || Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ"),
            jettonBMinter: jettonBMinter,
            jettonBWallet: jettonBWallet || Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")
        };

    }

    async getPoolInfo(provider: ContractProvider): 
    Promise<{
        set: boolean,
        apr: bigint,
        reward_period: bigint, 
        jetton_b_balance: bigint, 
        jetton_b_allocated: bigint,
        jetton_a_staked: bigint,
        jetton_a_maximum_stake: bigint,
        jetton_a_minimum_stake: bigint,
    }> 
    {
        const data = await provider.get("get_pool_info", []);
        const stack = await data.stack;
        let set = stack.readBoolean();
        let apr = stack.readBigNumber();
        let reward_period = stack.readBigNumber();

        let jetton_b_balance = stack.readBigNumber();
        let jetton_b_allocated = stack.readBigNumber();
        let jetton_a_staked = stack.readBigNumber();
        let jetton_a_maximum_stake = stack.readBigNumber();
        let jetton_a_minimum_stake = stack.readBigNumber();

        return {
            set: set,
            apr: apr,
            reward_period:reward_period, 
            jetton_b_balance: jetton_b_balance, 
            jetton_b_allocated: jetton_b_allocated,
            jetton_a_staked: jetton_a_staked,
            jetton_a_maximum_stake: jetton_a_maximum_stake,
            jetton_a_minimum_stake: jetton_a_minimum_stake,
        };

    }

    async getInitializer(provider: ContractProvider): 
    Promise<Address> 
    {
        const data = await provider.get("get_initializer", []);
        const stack = await data.stack;
        let initializer = stack.readAddress();
        return initializer;
    }

}
