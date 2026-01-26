"use client";

import { useState } from "react";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  FormFillerData,
  Activity,
  AICTE_CATEGORIES,
  SEMESTERS,
} from "@/lib/types/form-filler";
import { nanoid } from "nanoid";
import { differenceInDays, parseISO } from "date-fns";

interface ActivityListProps {
  control: Control<FormFillerData>;
  register: UseFormRegister<FormFillerData>;
  setValue: UseFormSetValue<FormFillerData>;
  getValues: UseFormGetValues<FormFillerData>;
}

const defaultActivity: Omit<Activity, "id" | "slNo"> = {
  semester: "",
  name: "",
  aicteMapping: "",
  startDate: "",
  endDate: "",
  duration: 0,
  place: "",
  detailedReportPageNo: "",
  certificateAttached: false,
  hoursSpent: 0,
  pointsEarned: 0,
  description: "",
  photos: [],
  outcomes: "",
  signatureOfCounsellor: "",
};

export function ActivityList({
  control,
  register,
  setValue,
  getValues,
}: ActivityListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  // Watch activities for table updates
  const activities = useWatch({
    control,
    name: "activities",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const addActivity = () => {
    append({
      ...defaultActivity,
      id: nanoid(),
      slNo: fields.length + 1,
    });
    setEditingIndex(fields.length); // Next index
    setIsDialogOpen(true);
  };

  const editActivity = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const deleteActivity = (index: number) => {
    remove(index);
    if (editingIndex === index) {
      setIsDialogOpen(false);
      setEditingIndex(-1);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleDateChange = (
    index: number,
    field: "startDate" | "endDate",
    value: string
  ) => {
    const otherField = field === "startDate" ? "endDate" : "startDate";
    const otherValue = getValues(`activities.${index}.${otherField}`);

    if (value && otherValue) {
      const start = field === "startDate" ? value : otherValue;
      const end = field === "startDate" ? otherValue : value;
      const days = differenceInDays(parseISO(end), parseISO(start)) + 1;
      setValue(`activities.${index}.duration`, days);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activities ({fields.length})</h2>
        <Button type="button" onClick={addActivity} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Sl.</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Sem</TableHead>
              <TableHead>Points</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No activities added. Click "Add Activity" to start.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => {
                const activity = activities?.[index] || {};
                const dateRange =
                  activity.startDate && activity.endDate
                    ? `${activity.startDate} to ${activity.endDate}`
                    : "-";

                return (
                  <TableRow key={field.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {activity.name || "Untitled Activity"}
                    </TableCell>
                    <TableCell>{dateRange}</TableCell>
                    <TableCell>{activity.semester || "-"}</TableCell>
                    <TableCell>{activity.pointsEarned || 0}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editActivity(index)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteActivity(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex >= 0
                ? `Edit Activity ${editingIndex + 1}`
                : "Activity Details"}
            </DialogTitle>
          </DialogHeader>

          {editingIndex >= 0 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(`activities.${editingIndex}.semester`, value)
                    }
                    defaultValue={getValues(`activities.${editingIndex}.semester`)}
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>Hours Spent</Label>
                  <Input
                    type="number"
                    {...register(`activities.${editingIndex}.hoursSpent`, {
                      valueAsNumber: true,
                    })}
                    placeholder="e.g. 50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    {...register(`activities.${editingIndex}.pointsEarned`, {
                      valueAsNumber: true,
                    })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Name</Label>
                <Input
                  {...register(`activities.${editingIndex}.name`)}
                  placeholder="e.g., Blood Donation Camp"
                />
              </div>

              <div className="space-y-2">
                <Label>AICTE Category</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      `activities.${editingIndex}.aicteMapping`,
                      value
                    )
                  }
                  defaultValue={getValues(
                    `activities.${editingIndex}.aicteMapping`
                  )}
                >
                  <SelectTrigger>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    {...register(`activities.${editingIndex}.startDate`, {
                      onChange: (e) =>
                        handleDateChange(editingIndex, "startDate", e.target.value),
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    {...register(`activities.${editingIndex}.endDate`, {
                      onChange: (e) =>
                        handleDateChange(editingIndex, "endDate", e.target.value),
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Place</Label>
                <Input
                  {...register(`activities.${editingIndex}.place`)}
                  placeholder="RVCE Campus"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cert-check"
                  onCheckedChange={(checked) =>
                    setValue(
                      `activities.${editingIndex}.certificateAttached`,
                      !!checked
                    )
                  }
                  defaultChecked={getValues(
                   `activities.${editingIndex}.certificateAttached`
                  )}
                />
                <Label htmlFor="cert-check">Certificate Available</Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  {...register(`activities.${editingIndex}.description`)}
                  placeholder="Describe the activity..."
                />
              </div>

              <div className="space-y-2">
                <Label>Outcomes</Label>
                <Textarea
                  {...register(`activities.${editingIndex}.outcomes`)}
                  placeholder="What did you learn?"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                 <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
