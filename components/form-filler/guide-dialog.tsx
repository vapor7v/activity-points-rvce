import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw } from "lucide-react";

export const GuideDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 font-bold text-lg">
          <BookOpen className="w-5 h-5" />
          Guide
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to use this tool</DialogTitle>
          <DialogDescription>
            Follow these steps to generate your AICTE Activity Points report:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enter your student details and signatory information.</li>
            <li>Add your activities one by one in the "Activity Details" section.</li>
            <li>
              <strong>Important:</strong> Click the{" "}
              <span className="font-semibold inline-flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Generate Preview
              </span>{" "}
              button to save your changes and update the PDF.
            </li>
            <li>Review the generated PDF preview on the right (or bottom on mobile).</li>
            <li>Download the final PDF when ready.</li>
          </ol>
          <div className="p-4 bg-muted rounded-md text-sm">
            <p className="mb-2 font-semibold">Sample Report:</p>
            <p>
              Please refer to this sampple report for more details
            </p>
            <Button
              variant="link"
              className="px-0 text-primary h-auto mt-1"
              onClick={() => window.open("/report.pdf", "_blank")}
            >
              View Sample Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
