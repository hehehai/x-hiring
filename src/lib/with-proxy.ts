import { ProxyAgent, setGlobalDispatcher } from "undici";
import { env } from "@/env";

if (env.NODE_ENV === "development" && env.LOCAL_FETCH_PROXY) {
  setGlobalDispatcher(new ProxyAgent(env.LOCAL_FETCH_PROXY));
}
