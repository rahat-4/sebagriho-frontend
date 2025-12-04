// File: app/(organization)/[organizationId]/medicines/components/StatCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card
    className={`p-2 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${color}`}
  >
    <CardContent className="px-1">
      <div className="flex flex-col items-center">
        <div className="bg-white/20 p-1 rounded-xl">{icon}</div>
        <div>
          <p className="text-white/90 text-xs font-medium">{title}</p>
          <p className="text-sm text-center font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
