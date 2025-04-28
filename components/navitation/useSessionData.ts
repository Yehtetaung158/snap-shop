"use client";

import { useSession } from "next-auth/react";

export default function useSessionData() {
  const { data: session, status } = useSession();

  
  return { session, status }; 
}
