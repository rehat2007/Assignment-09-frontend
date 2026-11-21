"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function PaymentSuccessToast({
  amount,
  transactionId,
}: {
  amount: number;
  transactionId: string;
}) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success(`Payment of $${amount} verified.`, {
      description: `Transaction ${transactionId}`,
    });
  }, [amount, transactionId]);

  return null;
}
