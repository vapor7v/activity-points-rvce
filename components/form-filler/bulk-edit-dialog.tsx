"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, SEMESTERS } from "@/lib/types/form-filler";
import { toast } from "sonner";

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[];
  onApplyChanges: (updates: Partial<Activity>[]) => void;
}

type EditColumn = "hours" | "points" | "semester" | "place" | "aicteMapping";

export function BulkEditDialog({
  open,
  onOpenChange,
  activities,
  onApplyChanges,
}: BulkEditDialogProps) {
  const [selectedColumn, setSelectedColumn] = useState<EditColumn>("hours");
  const [editedValues, setEditedValues] = useState<Record<string, string | number>>({});

  const handleApply = () => {
    const updates: Partial<Activity>[] = activities.map((activity) => {
      const value = editedValues[activity.id];
      if (value === undefined || value === "") return {};

      switch (selectedColumn) {
        case "hours":
          return { hoursSpent: Number(value) };
        case "points":
          return { pointsEarned: Number(value) };
        case "semester":
          return { semester: String(value) };
        case "place":
          return { place: String(value) };
        case "aicteMapping":
          return { aicteMapping: String(value) };
        default:
          return {};
      }
    });

    onApplyChanges(updates);
    toast.success("Bulk changes applied");
    setEditedValues({});
    onOpenChange(false);
  };

  const handleReset = () => {
    setEditedValues({});
  };

  const getCurrentValue = (activity: Activity, column: EditColumn) => {
    switch (column) {
      case "hours":
        return activity.hoursSpent;
      case "points":
        return activity.pointsEarned;
      case "semester":
        return activity.semester;
      case "place":
        return activity.place;
      case "aicteMapping":
        return activity.aicteMapping;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Edit Activities</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            <Label>Select Column to Edit</Label>
            <Select
              value={selectedColumn}
              onValueChange={(value) => {
                setSelectedColumn(value as EditColumn);
                setEditedValues({});
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours Spent</SelectItem>
                            <SelectItem value="points">Points Earned</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="place">Place</SelectItem>
                <SelectItem value="aicteMapping">AICTE Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 border rounded-md p-4">
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No activities to edit
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center pb-4 border-b last:border-0"
                  >
                    <div className="font-medium text-sm w-12">{index + 1}</div>
                    <div className="space-y-1">
                      <div className="font-medium text-sm line-clamp-1">
                        {activity.name || "Untitled Activity"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current: {getCurrentValue(activity, selectedColumn) || "-"}
                      </div>
                    </div>
                    <div>
                        {selectedColumn === "semester" ? (
                        <Select
                          value={editedValues[activity.id]?.toString() || ""}
                          onValueChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [activity.id]: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Keep current" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Keep current</SelectItem>
                            {SEMESTERS.map((sem) => (
                              <SelectItem key={sem} value={sem}>
                                Sem {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={
                            selectedColumn === "hours" || selectedColumn === "points"
                              ? "number"
                              : "text"
                          }
                          placeholder="Keep current"
                           value={editedValues[activity.id] || ""}
                          onChange={(e) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [activity.id]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            Tip: Leave fields empty to keep their current values
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Clear All
          </Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
