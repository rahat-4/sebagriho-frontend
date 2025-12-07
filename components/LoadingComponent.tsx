import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";

export const LoadingComponent = ({ name }: { name: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-spin mx-auto"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-700 font-semibold text-lg">{name}</p>
          <p className="text-slate-500 text-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{message}</h3>
          <p className="text-slate-600 mb-6"></p>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
