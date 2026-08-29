import { Loader2 } from "lucide-react";

export default function StorefrontLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-charcoal/50" />
    </div>
  );
}
