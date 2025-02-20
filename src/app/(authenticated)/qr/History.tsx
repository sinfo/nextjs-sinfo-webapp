"use client";

import List from "@/components/List";
import { UserTile } from "@/components/user/UserTile";
import { getHistory, getUserFromQRCode } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (window) {
      setHistory(getHistory());
    }
  }, []);

  return !!history.length ? (
    <List title="Recently Scanned">
      {history
        .map(getUserFromQRCode)
        .map((u) => u && <UserTile key={u.id} user={u} />)}
    </List>
  ) : (
    <></>
  );
}
