import { ExpoConfig, ConfigContext } from "@expo/config";
import fs from "fs";
import path from "path";

type PublicEnvKey =
  | "EXPO_PUBLIC_FIREBASE_API_KEY"
  | "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
  | "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
  | "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
  | "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  | "EXPO_PUBLIC_FIREBASE_APP_ID"
  | "EXPO_PUBLIC_SUPABASE_URL"
  | "EXPO_PUBLIC_SUPABASE_ANON_KEY";

type AppExtra = Partial<Record<PublicEnvKey, string>> &
  Record<string, unknown>;

const allowedPublicKeys: readonly PublicEnvKey[] = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
] as const;

function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content: string = fs.readFileSync(filePath, "utf8");
  const entries: Record<string, string> = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed: string = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex: number = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key: string = trimmed.slice(0, separatorIndex).trim();
    let value: string = trimmed.slice(separatorIndex + 1).trim();

    const isQuoted: boolean =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));

    if (isQuoted) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  });

  return entries;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env: Record<string, string> = loadEnvFile(path.join(__dirname, ".env"));
  const extra: AppExtra = { ...(config.extra as AppExtra) };

  Object.entries(env).forEach(([key, value]) => {
    if (allowedPublicKeys.includes(key as PublicEnvKey)) {
      extra[key as PublicEnvKey] = value;
    }
  });

  const baseConfig: ExpoConfig = {
    ...config,
    name: config.name ?? "vitta",
    slug: config.slug ?? "vitta",
  };

  return {
    ...baseConfig,
    extra,
  };
};
