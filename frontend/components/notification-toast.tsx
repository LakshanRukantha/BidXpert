"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function ToastWithTitle({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: "destructive" | null;
}) {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          variant: "destructive",
          title: "This is a title",
          description: "This is a description",
        });
      }}
    >
      Show Toast
    </Button>
  );
}
