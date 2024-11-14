"use client";

import { DataTable } from "@/components/data-table/DataTable";
import type { CustomColumnDef } from "@/components/data-table/data-table-types";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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

const columns: CustomColumnDef<Project>[] = [
	{ accessorKey: 'id', header: 'ID' },
	{ accessorKey: 'title', header: 'Title' },
	{ accessorKey: 'description', header: 'Description' },
	{ accessorKey: 'status', header: 'Status' },
	{ accessorKey: 'assignee', header: 'Assignee' },
	{ accessorKey: 'dueDate', header: 'Due Date' },
	{ accessorKey: 'priority', header: 'Priority' },
	{ accessorKey: 'client', header: 'Client' },
	{ accessorKey: 'budget', header: 'Budget' },
	{ accessorKey: 'progress', header: 'Progress (%)' },
	{ accessorKey: 'createdAt', header: 'Created At' },
	{ accessorKey: 'updatedAt', header: 'Updated At' },
	{ accessorKey: 'tags', header: 'Tags' },
];

async function fetchData(
	page: number,
	pageSize: number,
	filters: Record<string, string>
): Promise<{ data: Project[]; total: number }> {
	const query = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		filters: JSON.stringify(filters),
	});

	const response = await fetch(`/api/projects?${query.toString()}`);
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	return response.json();
}

export default function Home() {
	return (
		<div className="h-screen flex items-center justify-center">
			<DataTable columns={columns} fetchData={fetchData} />
		</div>
	);
}
