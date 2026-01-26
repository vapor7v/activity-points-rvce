import { Separator } from "@/components/ui/separator";

interface FormSectionHeaderProps {
  title: string;
}

export function FormSectionHeader({ title }: FormSectionHeaderProps) {
  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-2xl font-medium">{title}</h3>
      <Separator />
    </div>
  );
}
