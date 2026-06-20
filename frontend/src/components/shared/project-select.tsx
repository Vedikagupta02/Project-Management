"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowAll?: boolean;
  className?: string;
}

export function ProjectSelect({
  value,
  onChange,
  placeholder = "Select project",
  allowAll = false,
  className,
}: ProjectSelectProps) {
  const { data: projects = [], isLoading } = useProjects();

  console.log("PROJECTS:", projects);
  console.log("SELECTED:", value);

  return (
    <Select
      value={value}
      onValueChange={(v) => v && onChange(v)}
    >
      <SelectTrigger className={className ?? "w-full sm:w-64"}>
      <SelectValue>
        {projects.find((p) => p._id === value)?.name ?? placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all">All projects</SelectItem>}
        {projects.map((project) => (
          <SelectItem key={project._id} value={project._id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
