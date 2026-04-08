"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateMedicineForm {
  name: string;
  power: string;
  expiration_date: string;
  is_available: boolean;
  manufacturer: string;
  total_quantity: string;
  unit_price: string;
  description: string;
  batch_number: string;
}

const initialFormData: CreateMedicineForm = {
  name: "",
  power: "",
  expiration_date: "",
  is_available: false,
  manufacturer: "",
  total_quantity: "",
  unit_price: "",
  description: "",
  batch_number: "",
};

const CreateMedicine = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateMedicineForm>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_available: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the data for API submission
      const submitData = {
        name: formData.name,
        power: formData.power || null,
        expiration_date: formData.expiration_date || null,
        is_available: formData.is_available,
        manufacturer: formData.manufacturer || null,
        total_quantity: formData.total_quantity
          ? parseInt(formData.total_quantity)
          : null,
        unit_price: formData.unit_price
          ? parseFloat(formData.unit_price)
          : null,
        description: formData.description || null,
        batch_number: formData.batch_number || null,
      };

      // Replace with your actual API endpoint
      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create medicine");
      }

      setSuccess(true);
      setFormData(initialFormData);

      // Optionally redirect after success
      setTimeout(() => {
        router.push("/medicines");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/medicines"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medicines
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">
          Create New Medicine
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new homeopathic medicine to your inventory
        </p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6" variant="default">
          <AlertDescription>
            Medicine created successfully! Redirecting to medicines list...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Medicine Information
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new homeopathic medicine entry
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter medicine name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="power">Power/Potency</Label>
                <Input
                  id="power"
                  name="power"
                  value={formData.power}
                  onChange={handleInputChange}
                  placeholder="e.g., 30C, 200C, Q"
                />
              </div>
            </div>

            {/* Manufacturer and Batch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch_number">Batch Number</Label>
                <Input
                  id="batch_number"
                  name="batch_number"
                  value={formData.batch_number}
                  onChange={handleInputChange}
                  placeholder="Enter batch number"
                />
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total_quantity">Total Quantity</Label>
                <Input
                  id="total_quantity"
                  name="total_quantity"
                  type="number"
                  min="0"
                  value={formData.total_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price</Label>
                <Input
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter medicine description, usage instructions, or notes"
                rows={4}
              />
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="is_available"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Medicine is currently available
              </Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading || !formData.name}
                className="flex-1 md:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Medicine
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMedicine;

// export const metadata = {
//   title: "Create Medicine",
//   description: "Add a new homeopathic medicine to your inventory",
// };
