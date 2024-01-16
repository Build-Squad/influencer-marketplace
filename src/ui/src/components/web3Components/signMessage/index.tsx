import { Button } from "@mui/material";
import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import { notification } from "../../shared/notification";

type SignMessageProps = {
  onSignMessageSuccess: () => Promise<void>;
};

export const SignMessage = ({ onSignMessageSuccess }: SignMessageProps) => {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");

      const message = new TextEncoder().encode(
        `Authorize this signature to login to Xfluencer.\nUser:\n${publicKey.toBase58()}\n`
      );
      const signature = await signMessage(message);

      if (!ed25519.verify(signature, message, publicKey.toBytes()))
        throw new Error("Message signature invalid!");
      await onSignMessageSuccess();
    } catch (error: any) {
      notification(`Sign Message failed: ${error?.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [publicKey, signMessage]);

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={onClick}
      disabled={!publicKey || !signMessage}
      sx={{
        borderRadius: 8,
        "& .MuiButton-root": {
          borderRadius: 8,
          color: "#ffffff",
        },
      }}
    >
      {loading ? "Signing In..." : "Sign In"}
    </Button>
  );
};
