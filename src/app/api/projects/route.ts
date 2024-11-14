import { faker } from "@faker-js/faker";
import { type NextRequest, NextResponse } from "next/server";

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

// Generate mock data
const generateMockData = (): Project[] => {
	return Array.from({ length: 1000 }).map((_, i) => ({
		id: i + 1,
		title: faker.commerce.productName(),
		description: faker.lorem.sentence(),
		status: faker.helpers.arrayElement([
			"Open",
			"In Progress",
			"Completed",
			"On Hold",
		]),
		assignee: faker.name.fullName(),
		dueDate: faker.date.soon().toISOString(),
		priority: faker.helpers.arrayElement(["Low", "Medium", "High"]),
		client: faker.company.name(),
		budget: faker.number.int({ min: 1000, max: 10000 }),
		progress: faker.number.int({ min: 0, max: 100 }),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.recent().toISOString(),
		tags: faker.helpers.arrayElements(
			["Urgent", "Feature", "Bug", "Improvement"],
			2,
		),
	}));
};

const data = generateMockData();

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const page = Number.parseInt(searchParams.get("page") || "1");
	const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");
	const filters: Record<string, string> = JSON.parse(
		searchParams.get("filters") || "{}",
	);

	let filteredData = data;

	// Apply filtering
	Object.entries(filters).forEach(([key, value]) => {
		const filterValues = value.split(",").map((v) => v.trim().toLowerCase());
		filteredData = filteredData.filter((item) =>
			filterValues.some((filterValue) =>
				item[key as keyof Project]
					?.toString()
					.toLowerCase()
					.includes(filterValue),
			),
		);
	});

	const total = filteredData.length;
	const paginatedData = filteredData.slice(
		(page - 1) * pageSize,
		page * pageSize,
	);

	return NextResponse.json({ data: paginatedData, total });
}
