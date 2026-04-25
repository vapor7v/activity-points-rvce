"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Plus, Trash2, Pencil, X, GripVertical, Table2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import {
  FormFillerData,
  Activity,
  SEMESTERS,
  AICTE_CATEGORIES,
} from "@/lib/types/form-filler";
import { nanoid } from "nanoid";
import { differenceInDays, parseISO } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/hooks/use-user";
import { BulkEditDialog } from "./bulk-edit-dialog";
import { SortableTableRow } from "./sortable-row";


const uploadFile = async (file: File, userId: string) => {
  const supabase = createSupabaseBrowser();
  const fileExt = file.name.split(".").pop();
  const fileName = `${nanoid()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("activity-evidence")
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("activity-evidence")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

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
  certificateImage: "",
  certificateImages: [],
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


  const { data: user } = useUser();

  const activities = useWatch({
    control,
    name: "activities",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [expandingField, setExpandingField] = useState<string | null>(null);

  const aiExpand = async (field: `activities.${number}.description` | `activities.${number}.outcomes`) => {
    const currentText = getValues(field);
    if (!currentText || currentText.trim().length === 0) {
      alert("Please write some text first, then click AI Expand to enhance it.");
      return;
    }
    setExpandingField(field);
    try {
      const fieldType = field.includes('description') ? 'description' : 'outcomes';
      const activityName = getValues(`activities.${editingIndex}.name`) || 'the activity';
      const prompt = fieldType === 'description'
        ? `Expand the following short description of an activity called "${activityName}" into a detailed, well-written paragraph suitable for an AICTE Activity Points report for a college student. Keep it professional, factual, and concise (around 80-120 words). Only output the expanded text, no labels or quotes:\n\n${currentText}`
        : `Expand the following short outcomes of an activity called "${activityName}" into a detailed, well-written paragraph about learning outcomes suitable for an AICTE Activity Points report for a college student. Keep it professional and concise (around 60-100 words). Only output the expanded text, no labels or quotes:\n\n${currentText}`;

      const puter = (window as any).puter;
      if (!puter?.ai?.chat) {
        alert("AI service not loaded yet. Please try again.");
        setExpandingField(null);
        return;
      }
      const response = await puter.ai.chat(prompt, { model: "gpt-4o-mini" });
      const expandedText = typeof response === 'string' ? response : response?.message?.content || response?.toString() || '';
      if (expandedText) {
        setValue(field, expandedText.trim());
      }
    } catch (err) {
      console.error("AI expand error:", err);
      alert("AI expand failed. Please try again.");
    }
    setExpandingField(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const currentActivities = getValues("activities");
      const reorderedActivities = arrayMove(currentActivities, oldIndex, newIndex);

      // Update slNo for all activities
      const updatedActivities = reorderedActivities.map((act, idx) => ({
        ...act,
        slNo: idx + 1,
      }));

      setValue("activities", updatedActivities);
    }
  };

  const handleBulkEdit = (updates: Partial<Activity>[]) => {
    const currentActivities = getValues("activities");
    const updatedActivities = currentActivities.map((activity, index) => ({
      ...activity,
      ...updates[index],
    }));
    setValue("activities", updatedActivities);
  };

  const addActivity = () => {
    append({
      ...defaultActivity,
      id: nanoid(),
      slNo: fields.length + 1,
    });
    setEditingIndex(fields.length);
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
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setBulkEditOpen(true)}
            size="sm"
            variant="outline"
            disabled={fields.length === 0}
          >
            <Table2 className="w-4 h-4 mr-2" />
            Bulk Edit
          </Button>
          <Button type="button" onClick={addActivity} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="space-y-4 md:hidden">
        {fields.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground border rounded-md border-dashed">
            No activities added. Tap "Add Activity" to start.
          </div>
        ) : (
          fields.map((field, index) => {
            const activity = activities?.[index] || {};
            const dateRange =
              activity.startDate && activity.endDate
                ? `${activity.startDate} to ${activity.endDate}`
                : "-";

            return (
              <Card key={field.id} className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-base line-clamp-2">
                      {activity.name || "Untitled Activity"}
                    </div>
                    <div className="flex shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editActivity(index)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteActivity(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semester:</span>
                    <span>{activity.semester || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points:</span>
                    <span className="font-medium">{activity.pointsEarned || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates:</span>
                    <span>{dateRange}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Desktop View - Table */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="hidden md:block border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl.</TableHead>
                <TableHead className="w-[100px]">Activity Name</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Sem</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No activities added. Click "Add Activity" to start.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field, index) => {
                    const activity = activities?.[index] || {};
                    const dateRange =
                      activity.startDate && activity.endDate
                        ? `${activity.startDate} to ${activity.endDate}`
                        : "-";

                    return (
                      <SortableTableRow
                        key={field.id}
                        id={field.id}
                        index={index}
                        activity={activity}
                        dateRange={dateRange}
                        onEdit={() => editActivity(index)}
                        onDelete={() => deleteActivity(index)}
                      />
                    );
                  })}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      <BulkEditDialog
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        activities={activities || []}
        onApplyChanges={handleBulkEdit}
      />

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
                  onValueChange={(value) => {
                    if (value === "__manual__") {
                      setValue(`activities.${editingIndex}.aicteMapping`, "");
                    } else {
                      setValue(`activities.${editingIndex}.aicteMapping`, value);
                    }
                  }}
                  value={
                    (AICTE_CATEGORIES as readonly string[]).includes(getValues(`activities.${editingIndex}.aicteMapping`))
                      ? getValues(`activities.${editingIndex}.aicteMapping`)
                      : "__manual__"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AICTE Category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {AICTE_CATEGORIES.map((category, idx) => (
                      <SelectItem key={idx} value={category}>
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground shrink-0">{idx + 1}.</span>
                          <span className="line-clamp-2">{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="__manual__">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">✏️</span>
                        <span className="font-medium">Other (Enter Manually)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!(AICTE_CATEGORIES as readonly string[]).includes(getValues(`activities.${editingIndex}.aicteMapping`)) && (
                  <Input
                    {...register(`activities.${editingIndex}.aicteMapping`)}
                    placeholder="Enter custom AICTE category..."
                    className="mt-2"
                  />
                )}
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

              <div className="space-y-2">
                <Label>Detailed Report Page No</Label>
                <Input
                  {...register(`activities.${editingIndex}.detailedReportPageNo`)}
                  placeholder="e.g. 1-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate Available</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      `activities.${editingIndex}.certificateAttached`,
                      value === "yes"
                    )
                  }
                  value={activities?.[editingIndex]?.certificateAttached ? "yes" : "no"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950"
                    disabled={expandingField === `activities.${editingIndex}.description`}
                    onClick={() => aiExpand(`activities.${editingIndex}.description`)}
                  >
                    {expandingField === `activities.${editingIndex}.description` ? (
                      <AiOutlineLoading3Quarters className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    AI Expand
                  </Button>
                </div>
                <Textarea
                  {...register(`activities.${editingIndex}.description`)}
                  placeholder="Describe the activity..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Outcomes</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950"
                    disabled={expandingField === `activities.${editingIndex}.outcomes`}
                    onClick={() => aiExpand(`activities.${editingIndex}.outcomes`)}
                  >
                    {expandingField === `activities.${editingIndex}.outcomes` ? (
                      <AiOutlineLoading3Quarters className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    AI Expand
                  </Button>
                </div>
                <Textarea
                  {...register(`activities.${editingIndex}.outcomes`)}
                  placeholder="What did you learn?"
                />
              </div>

              <div className="space-y-2">
                <Label>Activity Photos</Label>


                {(activities?.[editingIndex]?.photos || []).length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {activities?.[editingIndex]?.photos?.map((photo, pIdx) => {
                      const totalPhotos = activities?.[editingIndex]?.photos?.length || 0;
                      return (
                      <div key={pIdx} className="relative group border rounded-md overflow-hidden aspect-video bg-muted">
                        <img
                          src={photo}
                          alt={`Photo ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {pIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const photos = [...(getValues(`activities.${editingIndex}.photos`) || [])];
                                [photos[pIdx - 1], photos[pIdx]] = [photos[pIdx], photos[pIdx - 1]];
                                setValue(`activities.${editingIndex}.photos`, photos);
                              }}
                              className="bg-black/70 text-white rounded p-0.5 hover:bg-black/90"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {pIdx < totalPhotos - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const photos = [...(getValues(`activities.${editingIndex}.photos`) || [])];
                                [photos[pIdx], photos[pIdx + 1]] = [photos[pIdx + 1], photos[pIdx]];
                                setValue(`activities.${editingIndex}.photos`, photos);
                              }}
                              className="bg-black/70 text-white rounded p-0.5 hover:bg-black/90"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const currentPhotos = getValues(`activities.${editingIndex}.photos`) || [];
                            const newPhotos = currentPhotos.filter((_, i) => i !== pIdx);
                            setValue(`activities.${editingIndex}.photos`, newPhotos);
                          }}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {pIdx + 1}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="cursor-pointer"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      if (!user?.id) {
                        alert("Please log in to upload images.");
                        return;
                      }

                      const validFiles = files.filter(file => {
                        if (file.size > 1024 * 1024) {
                          alert(`File ${file.name} is too large. Max size is 1MB.`);
                          return false;
                        }
                        return true;
                      });

                      if (validFiles.length === 0) return;

                      try {
                        const uploadedUrls = await Promise.all(
                          validFiles.map(async (file) => {
                            return await uploadFile(file, user.id);
                          })
                        );

                        const currentPhotos = getValues(`activities.${editingIndex}.photos`) || [];
                        setValue(`activities.${editingIndex}.photos`, [...currentPhotos, ...uploadedUrls]);


                        e.target.value = "";
                      } catch (err) {
                        console.error("Error uploading files", err);
                        alert("Error uploading images. Please try again.");
                      }
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(activities?.[editingIndex]?.photos || []).length} photos attached
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certificate Images</Label>

                {(() => {
                  const certImages = activities?.[editingIndex]?.certificateImages || [];
                  // Also show legacy single image if present and not already in the array
                  const legacyCert = activities?.[editingIndex]?.certificateImage;
                  const allCerts = legacyCert && !certImages.includes(legacyCert)
                    ? [legacyCert, ...certImages]
                    : certImages;
                  return allCerts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {allCerts.map((cert, cIdx) => {
                        const totalCerts = allCerts.length;
                        return (
                        <div key={cIdx} className="relative group border rounded-md overflow-hidden aspect-[4/3] bg-muted">
                          <img
                            src={cert}
                            alt={`Certificate ${cIdx + 1}`}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute bottom-1 left-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {cIdx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const certs = [...(getValues(`activities.${editingIndex}.certificateImages`) || [])];
                                  [certs[cIdx - 1], certs[cIdx]] = [certs[cIdx], certs[cIdx - 1]];
                                  setValue(`activities.${editingIndex}.certificateImages`, certs);
                                }}
                                className="bg-black/70 text-white rounded p-0.5 hover:bg-black/90"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {cIdx < totalCerts - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const certs = [...(getValues(`activities.${editingIndex}.certificateImages`) || [])];
                                  [certs[cIdx], certs[cIdx + 1]] = [certs[cIdx + 1], certs[cIdx]];
                                  setValue(`activities.${editingIndex}.certificateImages`, certs);
                                }}
                                className="bg-black/70 text-white rounded p-0.5 hover:bg-black/90"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentCerts = getValues(`activities.${editingIndex}.certificateImages`) || [];
                              // If removing the legacy image
                              if (cert === getValues(`activities.${editingIndex}.certificateImage`)) {
                                setValue(`activities.${editingIndex}.certificateImage`, "");
                              }
                              const newCerts = currentCerts.filter((_, i) => i !== (legacyCert && !currentCerts.includes(legacyCert) ? cIdx - 1 : cIdx));
                              setValue(`activities.${editingIndex}.certificateImages`, newCerts);
                              if (newCerts.length === 0 && !getValues(`activities.${editingIndex}.certificateImage`)) {
                                setValue(`activities.${editingIndex}.certificateAttached`, false);
                              }
                            }}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {cIdx + 1}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  ) : null;
                })()}

                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="cursor-pointer"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      if (!user?.id) {
                        alert("Please log in to upload certificates.");
                        return;
                      }

                      const validFiles = files.filter(file => {
                        if (file.size > 1024 * 1024) {
                          alert(`File ${file.name} is too large. Max size is 1MB.`);
                          return false;
                        }
                        return true;
                      });

                      if (validFiles.length === 0) return;

                      try {
                        const uploadedUrls = await Promise.all(
                          validFiles.map(async (file) => {
                            return await uploadFile(file, user.id);
                          })
                        );

                        const currentCerts = getValues(`activities.${editingIndex}.certificateImages`) || [];
                        setValue(`activities.${editingIndex}.certificateImages`, [...currentCerts, ...uploadedUrls]);
                        setValue(`activities.${editingIndex}.certificateAttached`, true);

                        e.target.value = "";
                      } catch (err) {
                        console.error("Error uploading files", err);
                        alert("Error uploading certificates. Please try again.");
                      }
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    const count = (activities?.[editingIndex]?.certificateImages || []).length
                      + (activities?.[editingIndex]?.certificateImage ? 1 : 0);
                    return `${count} certificate${count !== 1 ? 's' : ''} attached`;
                  })()}
                </div>
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
