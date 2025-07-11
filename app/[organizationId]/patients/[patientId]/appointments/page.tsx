"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { getData, deleteData } from "@/services/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface Medicine {
  uid: string;
  name: string;
  power?: string;
}

interface Appointment {
  uid: string;
  symptoms: string;
  treatment_effectiveness?: string;
  appointment_file?: string;
  medicines: Medicine[];
  created_at: string;
  updated_at: string;
  status?: "active" | "completed" | "cancelled";
}

interface PatientAppointmentListProps {
  organizationId: string;
  patientId: string;
  patientName?: string;
}

const PatientAppointmentList = () => {
  const { organizationId, patientId } = useParams();
  const [patientName, setPatientName] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch appointments with search and filters
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build URL with search parameters
      const baseUrl = `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments`;
      const params = new URLSearchParams();

      // Add search parameter if exists
      if (debouncedSearchQuery.trim()) {
        params.append("search", debouncedSearchQuery.trim());
      }

      // Add ordering
      const orderPrefix = sortOrder === "desc" ? "-" : "";
      params.append("ordering", `${orderPrefix}${sortBy}`);

      const url = params.toString()
        ? `${baseUrl}?${params.toString()}`
        : baseUrl;
      const [status, response] = await getData(url);

      // Fetch patient name
      const userUrl = `/public/auth/user-detail/${patientId}`;
      const [status2, userResponse] = await getData(userUrl);

      if (status2 === 200) {
        setPatientName(userResponse.name);
      }

      if (status === 200) {
        let appointmentData;
        if (response.results) {
          appointmentData = response.results;
        } else if (response.data) {
          appointmentData = response.data;
        } else if (Array.isArray(response)) {
          appointmentData = response;
        } else {
          appointmentData = [];
        }

        setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      } else {
        setError(`Failed to load appointments (Status: ${status})`);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Network error while loading appointments");
    } finally {
      setLoading(false);
    }
  }, [organizationId, patientId, debouncedSearchQuery, sortBy, sortOrder]);

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId: string) => {
    setDeleteLoading(true);
    try {
      const url = `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments/${appointmentId}`;
      const [status] = await deleteData(url);

      if (status === 200 || status === 204) {
        setAppointments((prev) =>
          prev.filter((app) => app.uid !== appointmentId)
        );
        setShowDeleteConfirm(null);
      } else {
        setError("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      setError("Network error while deleting appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter appointments based on status filter (client-side filtering)
  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") {
      return appointments;
    }
    return appointments.filter((appointment) => {
      const status = appointment.status || "active";
      return status === statusFilter;
    });
  }, [appointments, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  // Check if filters are active
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    sortBy !== "created_at" ||
    sortOrder !== "desc";

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {patientName && (
            <p className="text-slate-600 text-sm mt-1">
              Showing appointments for {patientName}
            </p>
          )}
          <p className="text-slate-500 text-xs mt-1">
            Total: {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by patient name, serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="updated_at-desc">
                  Recently Updated
                </SelectItem>
                <SelectItem value="updated_at-asc">Least Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                />
              </Badge>
            )}
            {(sortBy !== "created_at" || sortOrder !== "desc") && (
              <Badge variant="secondary" className="gap-1">
                Sort: {sortBy} ({sortOrder})
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setSortBy("created_at");
                    setSortOrder("desc");
                  }}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No appointments found
            </h3>
            <p className="text-slate-500">
              {searchQuery || statusFilter !== "all"
                ? "No appointments match your search criteria"
                : "No appointments have been created yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.uid}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-md">
                        {formatDate(appointment.created_at)}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {appointment.appointment_file && (
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download File
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setShowDeleteConfirm(appointment.uid)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Symptoms */}
                <div className="flex items-start gap-3">
                  <Activity className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-700 mb-1">
                      Symptoms
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {appointment.symptoms}
                    </p>
                  </div>
                </div>

                {/* Treatment Effectiveness */}
                {appointment.treatment_effectiveness && (
                  <div className="flex items-start gap-3">
                    <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">
                        Treatment Effectiveness
                      </h4>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {appointment.treatment_effectiveness}
                      </p>
                    </div>
                  </div>
                )}

                {/* Medicines */}
                {appointment.medicines.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Pill className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-700 mb-2">
                        Prescribed Medicines
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {appointment.medicines.map((medicine) => (
                          <Badge
                            key={medicine.uid}
                            variant="secondary"
                            className="px-2 py-1 bg-purple-100 text-purple-800"
                          >
                            <Pill className="w-3 h-3 mr-1" />
                            {medicine.name}
                            {medicine.power && (
                              <span className="ml-1 text-xs">
                                ({medicine.power})
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* File */}
                {appointment.appointment_file && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-700">
                        Attachment
                      </h4>
                      <p className="text-sm text-slate-600">File available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={selectedAppointment !== null}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {selectedAppointment &&
                `Created on ${formatDate(selectedAppointment.created_at)}`}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Symptoms */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-500" />
                  Symptoms
                </h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {selectedAppointment.symptoms}
                </p>
              </div>

              {/* Treatment Effectiveness */}
              {selectedAppointment.treatment_effectiveness && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    Treatment Effectiveness
                  </h4>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {selectedAppointment.treatment_effectiveness}
                  </p>
                </div>
              )}

              {/* Medicines */}
              {selectedAppointment.medicines.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Pill className="h-4 w-4 text-purple-500" />
                    Prescribed Medicines
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedAppointment.medicines.map((medicine) => (
                        <Badge
                          key={medicine.uid}
                          variant="secondary"
                          className="px-3 py-1 bg-purple-100 text-purple-800"
                        >
                          <Pill className="w-3 h-3 mr-1" />
                          {medicine.name}
                          {medicine.power && (
                            <span className="ml-1 text-xs">
                              ({medicine.power})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* File */}
              {selectedAppointment.appointment_file && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Attachment
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm !== null}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                showDeleteConfirm && handleDeleteAppointment(showDeleteConfirm)
              }
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointmentList;
