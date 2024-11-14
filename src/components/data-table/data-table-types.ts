import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type CustomColumnDef<T> = ColumnDef<T> & {
	accessorKey?: keyof T;
	header: string;
	cell?: (info: { getValue: () => unknown }) => ReactNode;
};

interface Project {
	id: number;
	title: string;
	description: string;
	status: string;
	assignee: string;
	dueDate: string;
	priority: string;
	client: string;
	budget: number;
	progress: number;
	createdAt: string;
	updatedAt: string;
	tags: string[];
}
