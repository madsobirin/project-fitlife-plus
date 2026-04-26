import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type TypeButton = {
  titleButton: string;
  isLoading?: boolean;
};

function SubmitButton({ titleButton, isLoading }: TypeButton) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-[26px] font-semibold text-white hover:bg-emerald-600 active:scale-[0.97] transition shadow-sm"
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : (
        <>
          {titleButton} <span className="ml-1">→</span>
        </>
      )}
    </Button>
  );
}

export default SubmitButton;
