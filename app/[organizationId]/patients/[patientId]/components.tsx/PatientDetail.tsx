// app/patients/[id]/page.tsx
import { Metadata } from "next";
import {
  ChevronLeft,
  User,
  Phone,
  Home,
  BookOpen,
  FileText,
  Dna,
  Calendar,
  Pill,
  ActivitySquare,
  Heart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define the type for our patient data
interface PatientData {
  id: string;
  serialNumber: string;
  oldSerialNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar?: string;
  address: string;
  phone: string;
  relativePhone: string;
  caseHistory: string;
  presentCause: string;
  miasmType: string;
  habits: string[];
  createdAt: string;
  // effectiveness: string;
}

// This could be defined in the individual page component
export const metadata: Metadata = {
  title: "Patient Details",
  description: "Detailed information about the patient",
};

// InfoItem component to display patient information consistently
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex space-x-3 py-2">
    <div className="mt-0.5">
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const PatientDetail = ({ patient }: { patient: PatientData }) => {
  // Get initials for avatar fallback

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Back button - visible on all screens */}
      {/* <Link href="/patients" className="inline-block mb-6"> */}
      <Button variant="ghost" size="sm" className="gap-1" onClick={() => {}}>
        <ChevronLeft className="h-4 w-4" />
        Back to Patients
      </Button>
      {/* </Link> */}

      {/* Patient header - responsive design */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-blue-100">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
            {patient.name}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 w-fit"
            >
              Serial #{patient.serialNumber}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">
            Previous ID: {patient.oldSerialNumber}
          </p>
          <p className="text-gray-600 flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            Last updated: {patient.createdAt}
          </p>
        </div>
      </div>

      {/* Main content with tabs - responsive */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <InfoItem icon={Home} label="Address" value={patient.address} />
                <InfoItem
                  icon={Phone}
                  label="Contact Number"
                  value={patient.phone}
                />
                <InfoItem
                  icon={Users}
                  label="Emergency Contact"
                  value={patient.relativePhone}
                />
              </CardContent>
            </Card>

            {/* Current Treatment Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Treatment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <InfoItem
                  icon={Pill}
                  label="Medicine Date Applied"
                  value={patient.createdAt}
                />
                {/* <InfoItem
                  icon={ActivitySquare}
                  label="Effectiveness"
                  value={
                    <span className="inline-flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200 mr-2"
                      >
                        {patient.effectiveness.split(" ")[0]}
                      </Badge>
                      {patient.effectiveness.split(" - ")[1]}
                    </span>
                  }
                /> */}
                <InfoItem
                  icon={Dna}
                  label="Miasm Selection"
                  value={patient.miasmType}
                />
              </CardContent>
            </Card>
          </div>

          {/* Patient Habits Card - Full width */}
          {/* <Card className="shadow-sm w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Habits</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {patient.habits.map((habit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                  >
                    <Heart className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{habit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Present Condition</CardTitle>
              <CardDescription>Current symptoms and cause</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>{patient.presentCause}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Treatment Details</CardTitle>
              <CardDescription>
                Current treatment plan and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Dna className="h-4 w-4 text-blue-500" />
                  Miasm Analysis
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">
                    Selected Miasm:{" "}
                    <span className="font-medium">{patient.miasmType}</span>
                  </p>
                  <Separator className="my-2" />
                  <p className="text-sm text-gray-600">
                    This miasm selection indicates a tendency toward chronic
                    recurring conditions that may manifest as periodic acute
                    episodes.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-blue-500" />
                  Medication Details
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date Applied</p>
                      <p className="font-medium">{patient.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Next Review Date</p>
                      <p className="font-medium">07/01/2023</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ActivitySquare className="h-4 w-4 text-blue-500" />
                  Treatment Effectiveness
                </h4>
                {/* <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{patient.effectiveness}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Case History</CardTitle>
              <CardDescription>Comprehensive medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>{patient.caseHistory}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Previous Consultations</CardTitle>
              <CardDescription>
                Record of past visits and treatments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "Dec 15, 2022",
                    reason: "Follow-up consultation",
                    notes:
                      "Patient reported partial improvement. Medication dosage adjusted.",
                  },
                  {
                    date: "Nov 01, 2022",
                    reason: "Initial consultation",
                    notes:
                      "First assessment completed. Treatment plan initiated.",
                  },
                ].map((visit, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-200 pl-4 py-1"
                  >
                    <p className="text-sm font-medium text-blue-600">
                      {visit.date}
                    </p>
                    <p className="text-sm font-medium mt-1">{visit.reason}</p>
                    <p className="text-sm text-gray-600 mt-1">{visit.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating action buttons - fixed at bottom on mobile, right side on desktop */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 sm:flex-row">
        <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
          <FileText className="h-4 w-4" />
          Edit Patient
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-blue-200 text-blue-600"
        >
          <Calendar className="h-4 w-4" />
          Schedule Visit
        </Button>
      </div>
    </div>
  );
};

export default PatientDetail;
