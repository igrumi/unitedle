import { DiscordSDK } from "@discord/embedded-app-sdk";

let sdk: DiscordSDK | null = null;

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

export const initDiscordSdk = async () => {
  try {
    sdk = new DiscordSDK(clientId);
    await sdk.ready();
    return sdk;
  } catch (e) {
    console.warn("No estamos en un entorno de Discord.");
    return null; // Retornamos null si estamos en navegador
  }
};