import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Heart, Dna } from "lucide-react";
import { Patient } from "@/types/patient.types";

const Medical = ({ patient }: { patient: Patient }) => {
  return (
    <>
      {patient.miasm_type && (
        <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex justify-center font-semibold items-center gap-2">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                <Dna className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm text-purple-600 font-medium">
                Miasm Type:
              </span>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
                {patient.miasm_type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {patient.habits && (
        <Card className="gap-3 p-2 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="gap-0">
            <CardTitle className="text-md font-bold text-slate-900 flex items-center justify-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                <Heart className="h-4 w-4 text-white" />
              </div>
              Patient Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/60">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {patient.habits}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {patient.case_history && (
        <Card className="gap-3 p-2 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="gap-0">
            <CardTitle className="text-md font-bold text-slate-900 flex items-center justify-center gap-2">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              Case History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/60">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {patient.case_history}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Medical;
