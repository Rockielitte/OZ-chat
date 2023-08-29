"use client";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

function useConservation() {
  const params = useParams();
  const conservationId = useMemo(() => {
    if (!params?.conservationId) {
      return "";
    }
    return params?.conservationId;
  }, [params?.conservationId]);
  const isOpen = useMemo(() => {
    return !!params?.conservationId;
  }, []);
  return [isOpen, conservationId];
}

export default useConservation;
