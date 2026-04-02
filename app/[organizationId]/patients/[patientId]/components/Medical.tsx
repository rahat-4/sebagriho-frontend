import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Heart, Dna } from "lucide-react";
import { Patient } from "@/types/patient.types";

const Medical = ({ patient }: { patient: Patient }) => {
  return (
    <>
      {patient.miasm_type && (
        <Card className="rounded-3xl border border-border/60 bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-center font-semibold items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Dna className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary-dark">
                Miasm Type:
              </span>
              <Badge className="border-border/60 bg-primary/10 px-3 py-1 text-primary-dark">
                {patient.miasm_type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {patient.habits && (
        <Card className="gap-3 rounded-3xl border border-border/60 bg-white/80 p-2 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg">
          <CardHeader className="gap-0">
            <CardTitle className="flex items-center justify-center gap-2 text-md font-bold text-foreground">
              <div className="rounded-lg bg-secondary p-2">
                <Heart className="h-4 w-4 text-secondary-foreground" />
              </div>
              Patient Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {patient.habits}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {patient.case_history && (
        <Card className="gap-3 rounded-3xl border border-border/60 bg-white/80 p-2 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg">
          <CardHeader className="gap-0">
            <CardTitle className="flex items-center justify-center gap-2 text-md font-bold text-foreground">
              <div className="rounded-lg bg-primary p-2">
                <AlertCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              Case History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
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
