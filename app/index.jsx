import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pages/admin/admin_home");
  }, [router]);

  return null;
}
