import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const LoadingComponent = ({ name }: { name: string }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="space-y-6 rounded-3xl border border-border/60 bg-white/80 p-8 text-center shadow-sm backdrop-blur">
        <div className="relative mx-auto h-16 w-16">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    </div>
  );
};

export const ErrorLoadingComponent = ({ message }: { message: string }) => {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">{message}</h3>
          <p className="mb-6 text-muted-foreground"></p>
          <Button
            onClick={() => router.back()}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
