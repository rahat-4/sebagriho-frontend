"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  Building2,
  Hash,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Pill,
  FileText,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getData, deleteData } from "@/services/api";
import { HomeopathicMedicine } from "@/types/medicine.types";
import {
  getExpirationStatus,
  formatDate,
  formatDateTime,
} from "@/lib/medicine.utils";

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <Icon className="w-5 h-5 text-[#205072] mt-0.5 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-semibold break-words">{value}</p>
    </div>
  </div>
);

const MedicineDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const medicineId = params.medicineId as string;
  const organizationId = params.organizationId as string;

  const [medicine, setMedicine] = useState<HomeopathicMedicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicineDetail();
  }, [medicineId]);

  const fetchMedicineDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const [status, response] = await getData(
        `/organization/homeopathy/${organizationId}/medicines/${medicineId}`
      );

      if (status !== 200) {
        throw new Error("Failed to fetch medicine details");
      }

      setMedicine(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load medicine details"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const [status] = await deleteData(
        `/organization/homeopathy/${organizationId}/medicines/${medicineId}`
      );

      if (status === 200 || status === 204) {
        router.push(`/organization/${organizationId}/medicines`);
      } else {
        throw new Error("Failed to delete medicine");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete medicine"
      );
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/organization/${organizationId}/medicines/${medicineId}/edit`);
  };

  const getStatusBadge = () => {
    if (!medicine) return null;

    const expirationStatus = getExpirationStatus(medicine.expiration_date);

    if (!medicine.is_available) {
      return (
        <Badge variant="destructive" className="gap-1.5 text-sm py-1.5">
          <XCircle className="w-4 h-4" />
          Out of Stock
        </Badge>
      );
    }

    if (expirationStatus === "expired") {
      return (
        <Badge variant="destructive" className="gap-1.5 text-sm py-1.5">
          <AlertTriangle className="w-4 h-4" />
          Expired
        </Badge>
      );
    }

    if (expirationStatus === "expiring_soon") {
      return (
        <Badge className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm py-1.5">
          <AlertTriangle className="w-4 h-4" />
          Expiring Soon
        </Badge>
      );
    }

    return (
      <Badge className="gap-1.5 bg-[#2ab7ca] hover:bg-[#2199aa] text-white text-sm py-1.5">
        <CheckCircle className="w-4 h-4" />
        Available
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#205072] mx-auto mb-4" />
          <p className="text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Medicine not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Medicines
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Medicine Details
              </h1>
              <p className="text-gray-600">
                Complete information about this medicine
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                className="bg-[#205072] hover:bg-[#183d56] text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{medicine.name}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Overview Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-[#205072] to-[#2d6a96] text-white rounded-t-lg">
              <div className="flex items-start gap-4">
                <div className="relative">
                  {medicine.avatar ? (
                    <img
                      src={medicine.avatar}
                      alt={medicine.name}
                      className="w-20 h-20 rounded-xl object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                      <Pill className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {medicine.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Power: {medicine.power}
                    </Badge>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {medicine.description && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#205072] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#205072] uppercase tracking-wide mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {medicine.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  icon={Building2}
                  label="Manufacturer"
                  value={medicine.manufacturer}
                />
                <DetailItem
                  icon={Hash}
                  label="Batch Number"
                  value={medicine.batch_number}
                />
                <DetailItem
                  icon={Package}
                  label="Total Quantity"
                  value={`${medicine.total_quantity} units`}
                />
                <DetailItem
                  icon={DollarSign}
                  label="Unit Price"
                  value={`$${medicine.unit_price.toFixed(2)}`}
                />
                <DetailItem
                  icon={Calendar}
                  label="Expiration Date"
                  value={formatDate(medicine.expiration_date)}
                />
                <DetailItem
                  icon={DollarSign}
                  label="Total Value"
                  value={`$${(
                    medicine.total_quantity * medicine.unit_price
                  ).toFixed(2)}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timestamps Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-[#205072]" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Created
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDateTime(medicine.created_at)}
                  </span>
                </div>
                {medicine.updated_at !== medicine.created_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Last Updated
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDateTime(medicine.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;
