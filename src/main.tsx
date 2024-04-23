import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// this manifest is used temporarily for development purposes
const manifestUrl =
	"https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<TonConnectUIProvider manifestUrl={manifestUrl}>
		<App />
	</TonConnectUIProvider>,
);
