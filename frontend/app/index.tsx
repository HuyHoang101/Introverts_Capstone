// app/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL();
      setInitialUrl(url || null);

      const t = await SecureStore.getItemAsync("accessToken");
      setToken(t ?? null);

      setLoading(false);
    })();
  }, []);

  const deepLinkToVerify = useMemo(() => {
    if (!initialUrl) return null;
    const { path, queryParams } = Linking.parse(initialUrl);
    const p = (path || "").replace(/^\//, "");
    if (p === "verify") {
      return { pathname: "/verify", params: queryParams } as any;
    }
    return null;
  }, [initialUrl]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Nếu app được mở bằng /verify?token=... thì đi verify
  if (deepLinkToVerify) {
    return <Redirect href={deepLinkToVerify} />;
  }

  // Mở bình thường: đi home hoặc login
  return <Redirect href={token ? "/home" : "/login"} />;
}
