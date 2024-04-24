import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";

import { useAsyncInitialize } from "./useAsyncInitialize";

export const network = "testnet";
// export const network = "mainnet";

export function useTonClient(): TonClient | undefined {
	return useAsyncInitialize(
		async () =>
			new TonClient({
				endpoint: await getHttpEndpoint({ network }),
			}),
	);
}
