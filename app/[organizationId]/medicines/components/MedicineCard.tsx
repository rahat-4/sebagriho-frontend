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
  Pill,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { HomeopathicMedicine } from "@/types/medicine.types";
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
      "flex items-center gap-3 px-3 p-[3px] bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200",
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
      <p className="text-xs text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const MedicineCard: React.FC<{ medicine: HomeopathicMedicine }> = ({
  medicine,
}) => {
  const isExpired = (date: string): boolean => {
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: string): boolean => {
    const expirationDate = new Date(date);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expirationDate <= thirtyDaysFromNow && expirationDate >= today;
  };

  // Determine expiration status
  const getExpirationStatus = () => {
    if (isExpired(medicine.expiration_date)) {
      return "expired";
    }
    if (isExpiringSoon(medicine.expiration_date)) {
      return "expiring_soon";
    }
    return "valid";
  };

  const expirationStatus = getExpirationStatus();

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

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="gap-2 group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Avatar or Medicine Icon */}
            <div className="relative">
              {medicine.avatar ? (
                <img
                  src={medicine.avatar}
                  alt={medicine.name}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-blue-100 group-hover:border-blue-200 transition-colors duration-200"
                />
              ) : (
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                  <Pill className="w-8 h-8 text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {medicine.name}
              </h3>
              <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                Power: {medicine.power}
              </p>
            </div>
            <div className="flex items-center flex-shrink-0">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {/* Description */}
        {medicine.description && (
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="flex items-start gap-1.5">
              <Info className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed text-xs">
                {medicine.description}
              </p>
            </div>
          </div>
        )}

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
              className={
                medicine.total_quantity === 0
                  ? "bg-red-50 hover:bg-red-100"
                  : ""
              }
            />

            <InfoItem label="Batch" value={medicine.batch_number} icon={Hash} />
          </div>

          <div className="space-y-1">
            <InfoItem
              label="Price"
              value={`${medicine.unit_price}`}
              icon={DollarSign}
              className="bg-emerald-50 hover:bg-emerald-100"
            />

            <InfoItem
              label="Expires"
              value={formatDate(medicine.expiration_date)}
              icon={Calendar}
              className={
                expirationStatus === "expired"
                  ? "bg-red-50 hover:bg-red-100"
                  : expirationStatus === "expiring_soon"
                  ? "bg-amber-50 hover:bg-amber-100"
                  : ""
              }
            />

            <InfoItem
              label="Added"
              value={formatDate(medicine.created_at)}
              icon={Clock}
            />
          </div>
        </div>

        {/* Footer with last updated */}
        {medicine.updated_at !== medicine.created_at && (
          <div className="text-xs text-gray-500 flex items-center gap-1 pt-1 border-t border-gray-100">
            <Clock className="w-3 h-3" />
            <span>Updated: {formatDate(medicine.updated_at)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
