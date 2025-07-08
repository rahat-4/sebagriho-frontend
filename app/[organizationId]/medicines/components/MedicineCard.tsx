import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Package,
  DollarSign,
  Hash,
  Calendar,
  Clock,
  ShoppingCart,
  Pill,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { HomeopathicMedicine } from "./medicineinterface";
import clsx from "clsx";

interface InfoItemProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  className?: string;
}

const InfoItem = ({ label, value, icon, className }: InfoItemProps) => (
  <div
    className={clsx(
      "flex items-center gap-3 px-3 p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200",
      className
    )}
  >
    {icon &&
      React.createElement(icon, {
        className: "w-4 h-4 text-gray-500 flex-shrink-0",
      })}
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const MedicineCard: React.FC<{ medicine: HomeopathicMedicine }> = ({
  medicine,
}) => {
  const expirationStatus = "tt";

  const getStatusBadge = () => {
    if (!medicine.is_available) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <XCircle className="w-3 h-3" />
          Out of Stock
        </Badge>
      );
    }

    if (expirationStatus === "expired") {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          Expired
        </Badge>
      );
    }

    if (expirationStatus === "expiring_soon") {
      return (
        <Badge
          variant="secondary"
          className="gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200"
        >
          <AlertTriangle className="w-3 h-3" />
          Expiring Soon
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="gap-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      >
        <CheckCircle className="w-3 h-3" />
        Available
      </Badge>
    );
  };

  const getPriceColor = () => {
    if (!medicine.is_available || expirationStatus === "expired") {
      return "text-gray-400";
    }
    return "text-emerald-600 font-semibold";
  };

  return (
    <Card className="gap-2 group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {medicine.name}
              </h3>
              <p className="text-sm font-medium text-blue-600 bg-blue-50 px-2 rounded-md inline-block">
                Power: {medicine.power}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* Description */}
        <p className="text-gray-700 leading-relaxed text-xs">
          {medicine.description}
        </p>

        <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div className="space-y-1">
            <InfoItem
              label="Manufacturer"
              value={medicine.manufacturer}
              icon={Building2}
            />

            <InfoItem
              label="Quantity"
              value={`${medicine.total_quantity} units`}
              icon={Package}
            />
          </div>

          <div className="space-y-1">
            <InfoItem
              label="Unit Price"
              value={`$${medicine.unit_price}`}
              icon={DollarSign}
              className="bg-emerald-50 hover:bg-emerald-100"
            />

            <InfoItem label="Batch" value={medicine.batch_number} icon={Hash} />
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Footer */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            Expires: {new Date(medicine.expiration_date).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
