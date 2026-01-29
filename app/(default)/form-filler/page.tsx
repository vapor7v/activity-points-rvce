"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { RefreshCw, Loader2, Github, Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormFillerData } from "@/lib/types/form-filler";
import dynamic from "next/dynamic";
import { format, differenceInDays, parseISO } from "date-fns";
import { ActivityList } from "@/components/form-filler/activity-list";
import { FormSectionHeader } from "@/components/form-filler/form-section-header";
import { StudentInfoForm } from "@/components/form-filler/student-info-form";
import { SignatoriesForm } from "@/components/form-filler/signatories-form";
import { GuideDialog } from "@/components/form-filler/guide-dialog";

import { DownloadPDFButton } from "@/components/form-filler/download-pdf-button";
import { loadFormData, saveFormData, migrateLocalStorageData, createDebouncedSave } from "@/lib/supabase/form-persistence";
import useUser from "@/hooks/use-user";
import { toast } from "sonner";

const PDFPreview = dynamic(
  () =>
    import("@/components/form-filler/pdf-preview").then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading PDF viewer...
      </div>
    ),
  }
);

interface FormContentProps {
  form: UseFormReturn<FormFillerData>;
  totalPoints: number;
  handleGeneratePreview: () => void;
  isGenerating: boolean;
  pdfContent?: React.ReactNode;
  previewData: FormFillerData;
}

const FormContent = ({
  form,
  totalPoints,
  handleGeneratePreview,
  isGenerating,
  pdfContent,
  previewData,
}: FormContentProps) => {
  const { register, setValue, control, getValues } = form;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GuideDialog />

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              window.open(
                "https://github.com/CubeStar1/aicte-activity-points",
                "_blank"
              )
            }
          >
            <Github className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>PDF Preview</SheetTitle>
                </SheetHeader>
                <div className="h-full bg-muted/50 p-4 overflow-hidden">
                  {pdfContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <DownloadPDFButton data={previewData} />

          <Button
            onClick={() => handleGeneratePreview()}
            size="sm"
            className="gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? "Generating..." : "Generate Preview"}
            </span>
            <span className="sr-only">{isGenerating ? "..." : "Generate"}</span>
          </Button>
        </div>
      </div>

      <StudentInfoForm
        register={register}
        setValue={setValue}
        totalPoints={totalPoints}
      />

      <div>
        <FormSectionHeader title="Activity Details" />
        <Card>
          <CardContent className="pt-0">
            <ActivityList
              control={control}
              register={register}
              setValue={setValue}
              getValues={getValues}
            />
          </CardContent>
        </Card>
      </div>

      <SignatoriesForm register={register} />
    </div>
  );
};

export default function FormFillerPage() {
  const [mounted, setMounted] = useState(false);
  const { data: user } = useUser();
  const debouncedSaveRef = useRef(createDebouncedSave(30000)); // 30 seconds

  const form = useForm<FormFillerData>({
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
      signatories: {
        evaluator1: { name: "", designation: "" },
        evaluator2: { name: "", designation: "" },
        counsellor: { name: "", designation: "" },
      },
    },
  });

  const { watch, getValues, reset } = form;

  const [previewData, setPreviewData] = useState<FormFillerData>({
    student: {
      name: "",
      usn: "",
      department: "",
      period: "2022-2026",
      totalPoints: 0,
    },
    activities: [],
    evaluations: [],
    signatories: {
      evaluator1: { name: "", designation: "" },
      evaluator2: { name: "", designation: "" },
      counsellor: { name: "", designation: "" },
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const activities = watch("activities");
  const totalPoints = activities.reduce(
    (sum, act) => sum + (act.pointsEarned || 0),
    0
  );

  const handleGeneratePreview = useCallback((data?: FormFillerData) => {
    const values = data || getValues();

    // Save to localStorage as backup
    if (typeof window !== "undefined") {
      localStorage.setItem("aicte-form-data", JSON.stringify(values));
    }

    // Auto-save to database if user is authenticated
    if (user) {
      debouncedSaveRef.current(values);
    }

    const currentTotalPoints = values.activities.reduce(
      (sum, act) => sum + (act.pointsEarned || 0),
      0
    );

    const newPreviewData: FormFillerData = {
      student: {
        ...values.student,
        totalPoints: currentTotalPoints,
      },
      activities: values.activities,
      evaluations: values.activities.map((act, idx) => {
        let durationStr = "";
        if (act.startDate && act.endDate) {
          try {
            const start = parseISO(act.startDate);
            const end = parseISO(act.endDate);
            const days = differenceInDays(end, start) + 1;
            durationStr = `${format(start, "dd-MM-yy")} to ${format(
              end,
              "dd-MM-yy"
            )}, ${days} day${days > 1 ? "s" : ""}`;
          } catch (e) {
            console.error("Date parsing error", e);
          }
        }

        return {
          slNo: idx + 1,
          nameOfStudent: values.student.name,
          usn: values.student.usn,
          typeOfWork: act.name,
          duration: durationStr,
          hoursSpent: act.hoursSpent,
          certificateAvailable: act.certificateAttached,
          pointsEarned: act.pointsEarned,
        };
      }),
      signatories: values.signatories,
    };

    setIsGenerating(true);
    setTimeout(() => {
      setPreviewData(newPreviewData);
      setIsGenerating(false);
    }, 600);
  }, [getValues, user]);

  // Watch all form changes for auto-save
  useEffect(() => {
    if (!mounted) return;
    const subscription = watch(() => {
      const values = getValues();
      handleGeneratePreview(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, mounted, getValues, handleGeneratePreview]);

  // Load data from database or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // Try to migrate localStorage data first
        await migrateLocalStorageData();

        // Load from database
        const { data: dbData, error } = await loadFormData();
        if (dbData) {
          reset(dbData);
          handleGeneratePreview(dbData);
          toast.success("Form loaded from cloud");
        } else if (error) {
          console.error("Error loading from database:", error);
          // Fallback to localStorage
          const savedData = localStorage.getItem("aicte-form-data");
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              reset(parsed);
              handleGeneratePreview(parsed);
              toast.info("Loaded from local storage");
            } catch (e) {
              console.error("Failed to load saved data", e);
              handleGeneratePreview();
            }
          } else {
            handleGeneratePreview();
          }
        } else {
          // No data in database, check localStorage
          const savedData = localStorage.getItem("aicte-form-data");
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              reset(parsed);
              handleGeneratePreview(parsed);
            } catch (e) {
              handleGeneratePreview();
            }
          } else {
            handleGeneratePreview();
          }
        }
      } else {
        // User not authenticated, use localStorage
        const savedData = localStorage.getItem("aicte-form-data");
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            reset(parsed);
            handleGeneratePreview(parsed);
          } catch (e) {
            console.error("Failed to load saved data", e);
            handleGeneratePreview();
          }
        } else {
          handleGeneratePreview();
        }
      }
      setMounted(true);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!mounted) return null;

  return (
    <div className="h-[calc(100vh)] bg-background">
      {/* Mobile Layout */}
      <div className="block md:hidden h-full">
        <ScrollArea className="h-full">
          <FormContent
            form={form}
            totalPoints={totalPoints}
            handleGeneratePreview={() => handleGeneratePreview()}
            isGenerating={isGenerating}
            pdfContent={<PDFPreview data={previewData} />}
            previewData={previewData}
          />
        </ScrollArea>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={45} minSize={30} maxSize={70}>
            <ScrollArea className="h-full">
              <FormContent
                form={form}
                totalPoints={totalPoints}
                handleGeneratePreview={() => handleGeneratePreview()}
                isGenerating={isGenerating}
                pdfContent={<PDFPreview data={previewData} />}
                previewData={previewData}
              />
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={55} minSize={30} maxSize={70}>
            <div className="h-full">
              <PDFPreview data={previewData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
