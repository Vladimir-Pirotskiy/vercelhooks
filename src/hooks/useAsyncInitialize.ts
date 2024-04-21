import { useEffect, useState } from "react";
import {TonClient} from "@ton/ton";
import {getHttpEndpoint} from "@orbs-network/ton-access";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = [],
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}

