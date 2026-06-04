import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { NativeModules, Platform } from "react-native";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function getExpoHostBaseUrl() {
  const linkingUrl = Linking.createURL("/");
  if (linkingUrl) {
    try {
      const parsed = new URL(linkingUrl);
      if (parsed.hostname) {
        return `http://${parsed.hostname}:8081`;
      }
    } catch {
      // ignore parse errors and continue to other fallbacks
    }
  }

  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (typeof scriptURL === "string" && scriptURL) {
    try {
      const parsed = new URL(scriptURL);
      if (parsed.hostname) {
        return `http://${parsed.hostname}:8081`;
      }
    } catch {
      // ignore parse errors and continue to other fallbacks
    }
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost ||
    "";

  if (!hostUri) {
    return null;
  }

  const host = String(hostUri).split(":")[0]?.trim();
  if (!host) {
    return null;
  }

  return `http://${host}:8081`;
}

export function getApiBaseUrl() {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (envBaseUrl) {
    return normalizeBaseUrl(envBaseUrl);
  }

  if (Platform.OS === "web") {
    return "";
  }

  const expoHostBaseUrl = getExpoHostBaseUrl();
  if (expoHostBaseUrl) {
    return normalizeBaseUrl(expoHostBaseUrl);
  }

  return "http://localhost:8081";
}

export function buildApiUrl(path: string) {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/api${safePath}`;
}
