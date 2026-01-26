"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RefreshCw, Loader2, Github, Eye } from "lucide-react";
import { FormFillerData } from "@/lib/types/form-filler";
import dynamic from "next/dynamic";
import { format, differenceInDays, parseISO } from "date-fns";
import { ActivityList } from "@/components/form-filler/activity-list";
import { FormSectionHeader } from "@/components/form-filler/form-section-header";
import { StudentInfoForm } from "@/components/form-filler/student-info-form";
import { SignatoriesForm } from "@/components/form-filler/signatories-form";

import { DownloadPDFButton } from "@/components/form-filler/download-pdf-button";

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
          <h1 className="hidden md:block text-2xl font-bold">Activity Points</h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              window.open(
                "https://github.com/CubeStar1/aicte-activity-points",
                "_blank"
              )
            }
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">Star</span>
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
            <span className="hidden sm:inline">{isGenerating ? "Generating..." : "Generate Preview"}</span>
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

  const handleGeneratePreview = (data?: FormFillerData) => {
    const values = data || getValues();

    if (typeof window !== "undefined") {
      localStorage.setItem("aicte-form-data", JSON.stringify(values));
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
  };

  useEffect(() => {
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
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <ResizablePanel defaultSize={40} minSize={30}>
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

          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full">
              <PDFPreview data={previewData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
