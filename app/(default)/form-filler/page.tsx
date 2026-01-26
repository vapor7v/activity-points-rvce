"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Plus, Trash2, Printer } from "lucide-react";
import {
  FormFillerData,
  Activity,
  AICTE_CATEGORIES,
  DEPARTMENTS,
  SEMESTERS,
} from "@/lib/types/form-filler";
import { PrintDocument } from "@/components/form-filler/print-document";
import { nanoid } from "nanoid";

const defaultActivity: Omit<Activity, "id" | "slNo"> = {
  semester: "",
  name: "",
  aicteMapping: "",
  dateAndDuration: "",
  place: "",
  detailedReportPageNo: "",
  certificateAttached: false,
  pointsEarned: 0,
  description: "",
  photos: [],
  outcomes: "",
  signatureOfCounsellor: "",
};

export default function FormFillerPage() {
  const { register, control, watch, setValue, getValues } =
    useForm<FormFillerData>({
      defaultValues: {
        student: {
          name: "",
          usn: "",
          department: "",
          period: "2022-2026",
          totalPoints: 0,
        },
        activities: [],
        evaluations: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  // Watch all form values for live preview
  const formValues = watch();

  // Calculate total points
  const activities = watch("activities");
  const totalPoints = activities.reduce(
    (sum, act) => sum + (act.pointsEarned || 0),
    0
  );

  // Live preview data
  const previewData: FormFillerData = {
    student: {
      ...formValues.student,
      totalPoints,
    },
    activities: formValues.activities,
    evaluations: formValues.activities.map((act, idx) => ({
      slNo: idx + 1,
      nameOfStudent: formValues.student.name,
      usn: formValues.student.usn,
      typeOfWork: act.name,
      duration: act.dateAndDuration,
      hoursSpent: 0,
      certificateAvailable: act.certificateAttached,
      pointsEarned: act.pointsEarned,
    })),
  };

  const addActivity = () => {
    append({
      ...defaultActivity,
      id: nanoid(),
      slNo: fields.length + 1,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-[calc(100vh-60px)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Form */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">AICTE Activity Form</h1>
                <Button onClick={handlePrint} size="sm" className="print:hidden">
                  <Printer className="w-4 h-4 mr-2" />
                  Print PDF
                </Button>
              </div>

              {/* Student Information */}
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">Student Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onValueChange={(value) =>
                        setValue("student.department", value)
                      }
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
                </CardContent>
              </Card>

              {/* Activities */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg">
                    Activities ({fields.length})
                  </CardTitle>
                  <Button type="button" onClick={addActivity} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No activities added. Click "Add" to start.
                    </p>
                  ) : (
                    fields.map((field, index) => (
                      <Card key={field.id} className="border">
                        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
                          <CardTitle className="text-sm font-medium">
                            Activity {index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 px-4 pb-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Semester</Label>
                            <Select
                              onValueChange={(value) =>
                                setValue(`activities.${index}.semester`, value)
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {SEMESTERS.map((sem) => (
                                  <SelectItem key={sem} value={sem}>
                                    Sem {sem}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Points</Label>
                            <Input
                              type="number"
                              className="h-8"
                              {...register(`activities.${index}.pointsEarned`, {
                                valueAsNumber: true,
                              })}
                              placeholder="10"
                            />
                          </div>

                          <div className="space-y-1 col-span-2">
                            <Label className="text-xs">Activity Name</Label>
                            <Input
                              className="h-8"
                              {...register(`activities.${index}.name`)}
                              placeholder="e.g., Blood Donation Camp"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">AICTE Category</Label>
                            <Select
                              onValueChange={(value) =>
                                setValue(
                                  `activities.${index}.aicteMapping`,
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {AICTE_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Date & Duration</Label>
                            <Input
                              className="h-8"
                              {...register(
                                `activities.${index}.dateAndDuration`
                              )}
                              placeholder="15-Jan-2024"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Place</Label>
                            <Input
                              className="h-8"
                              {...register(`activities.${index}.place`)}
                              placeholder="RVCE Campus"
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-4">
                            <Checkbox
                              id={`cert-${index}`}
                              onCheckedChange={(checked) =>
                                setValue(
                                  `activities.${index}.certificateAttached`,
                                  !!checked
                                )
                              }
                            />
                            <Label htmlFor={`cert-${index}`} className="text-xs">
                              Certificate
                            </Label>
                          </div>

                          <div className="space-y-1 col-span-2">
                            <Label className="text-xs">Description</Label>
                            <Textarea
                              {...register(`activities.${index}.description`)}
                              placeholder="Describe the activity..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-1 col-span-2">
                            <Label className="text-xs">Outcomes</Label>
                            <Textarea
                              {...register(`activities.${index}.outcomes`)}
                              placeholder="What did you learn?"
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Live Preview */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <ScrollArea className="h-full bg-gray-100">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between print:hidden">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  Changes update in real-time
                </p>
              </div>
              <div className="transform scale-[0.7] origin-top-left w-[142%]">
                <PrintDocument data={previewData} />
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
