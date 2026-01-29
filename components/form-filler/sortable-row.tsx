import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Activity } from "@/lib/types/form-filler";

interface SortableTableRowProps {
  id: string;
  index: number;
  activity: Activity;
  dateRange: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableTableRow({
  id,
  index,
  activity,
  dateRange,
  onEdit,
  onDelete,
}: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <span>{index + 1}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {activity.name || "Untitled Activity"}
      </TableCell>
      <TableCell>{dateRange}</TableCell>
      <TableCell>{activity.semester || "-"}</TableCell>
      <TableCell>{activity.pointsEarned || 0}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
