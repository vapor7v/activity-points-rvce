"use client";

import { UseFormRegister } from "react-hook-form";
import { FormFillerData } from "@/lib/types/form-filler";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormSectionHeader } from "./form-section-header";

interface SignatoriesFormProps {
  register: UseFormRegister<FormFillerData>;
}

export function SignatoriesForm({ register }: SignatoriesFormProps) {
  return (
    <div>
      <FormSectionHeader title="Signatories" />
      <Card>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Evaluator 1</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  {...register("signatories.evaluator1.name")}
                  placeholder="Name"
                />
                <Input
                  {...register("signatories.evaluator1.designation")}
                  placeholder="Designation"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Evaluator 2</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  {...register("signatories.evaluator2.name")}
                  placeholder="Name"
                />
                <Input
                  {...register("signatories.evaluator2.designation")}
                  placeholder="Designation"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Counsellor</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  {...register("signatories.counsellor.name")}
                  placeholder="Name"
                />
                <Input
                  {...register("signatories.counsellor.designation")}
                  placeholder="Designation"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
