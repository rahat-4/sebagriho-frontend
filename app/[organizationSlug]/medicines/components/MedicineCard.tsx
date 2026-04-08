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
import clsx from "clsx";

import { HomeopathicMedicine } from "@/types/medicine.types";

interface InfoItemProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  className?: string;
}

const InfoItem = ({ label, value, icon: Icon, className }: InfoItemProps) => (
  <div
    className={clsx(
      "flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-2 transition-colors duration-200 hover:bg-muted",
      className
    )}
  >
    {Icon && <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-xs font-medium text-foreground">{value}</p>
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
          className="gap-1.5 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15"
        >
          <AlertTriangle className="w-3 h-3" />
          Expiring Soon
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="gap-1.5 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
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
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Avatar or Medicine Icon */}
            <div className="relative">
              {medicine.avatar ? (
                <img
                  src={medicine.avatar}
                  alt={medicine.name}
                  className="h-12 w-12 rounded-xl border border-border/60 object-cover transition-colors duration-200 group-hover:border-primary/30"
                />
              ) : (
                <div className="rounded-xl bg-primary/10 p-2 transition-colors duration-200 group-hover:bg-primary/15">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-md font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                {medicine.name}
              </h3>
              <p className="inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Power: {medicine.power}
              </p>
            </div>
            <div className="flex items-center flex-shrink-0">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-4">
        {/* Description */}
        {medicine.description && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex items-start gap-1.5">
              <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {medicine.description}
              </p>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
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
                  ? "bg-rose-500/10 hover:bg-rose-500/15"
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
              className="bg-emerald-500/10 hover:bg-emerald-500/15"
            />

            <InfoItem
              label="Expires"
              value={formatDate(medicine.expiration_date)}
              icon={Calendar}
              className={
                expirationStatus === "expired"
                  ? "bg-rose-500/10 hover:bg-rose-500/15"
                  : expirationStatus === "expiring_soon"
                  ? "bg-amber-500/10 hover:bg-amber-500/15"
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
          <div className="flex items-center gap-1 border-t border-border/60 pt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated: {formatDate(medicine.updated_at)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
