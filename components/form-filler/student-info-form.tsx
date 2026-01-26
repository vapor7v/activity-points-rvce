"use client";

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormFillerData, DEPARTMENTS } from "@/lib/types/form-filler";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FormSectionHeader } from "./form-section-header";

interface StudentInfoFormProps {
  register: UseFormRegister<FormFillerData>;
  setValue: UseFormSetValue<FormFillerData>;
  totalPoints: number;
}

export function StudentInfoForm({
  register,
  setValue,
  totalPoints,
}: StudentInfoFormProps) {
  return (
    <div>
      <FormSectionHeader title="Student Information" />
      <Card>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                {...register("student.name")}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usn">USN</Label>
              <Input
                id="usn"
                {...register("student.usn")}
                placeholder="e.g., 1RV22CS001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                onValueChange={(value) => setValue("student.department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Programme Period</Label>
              <Input
                id="period"
                {...register("student.period")}
                placeholder="e.g., 2022-2026"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Total Points: {totalPoints}/100</Label>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(totalPoints, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {totalPoints >= 100
                  ? "✅ Required 100 points completed!"
                  : `${100 - totalPoints} more points needed`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
