"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Plus, Trash2, RefreshCw, Loader2, Github } from "lucide-react";
import {
  FormFillerData,
} from "@/lib/types/form-filler";
import dynamic from "next/dynamic";
import { format, differenceInDays, parseISO } from "date-fns";
import { ActivityList } from "@/components/form-filler/activity-list";
import { FormSectionHeader } from "@/components/form-filler/form-section-header";
import { StudentInfoForm } from "@/components/form-filler/student-info-form";
import { SignatoriesForm } from "@/components/form-filler/signatories-form";

const PDFPreview = dynamic(
  () => import("@/components/form-filler/pdf-preview").then((mod) => mod.PDFPreview),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading PDF viewer...</div> }
);

export default function FormFillerPage() {
  const { register, control, watch, setValue, getValues, reset } =
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
        signatories: {
          evaluator1: { name: "", designation: "" },
          evaluator2: { name: "", designation: "" },
          counsellor: { name: "", designation: "" },
        },
      },
    });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={40} minSize={30}>
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Activity Points</h1>
                  <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open("https://github.com/CubeStar1/aicte-activity-points", "_blank")}
                  >
                    <Github className="w-4 h-4" />
                    Star
                  </Button>
                </div>
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
                  {isGenerating ? "Generating..." : "Generate Preview"}
                </Button>
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
  );
}
