"use client"
import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { router } from "@inertiajs/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Carousel = {
    id: string
    title: string
    description: string
    image: string
    status: "active" | "inactive"
}

const handleDelete = (id: string) => {
    router.delete(`/carousels/${id}`, {
        preserveScroll: true,
    });
};

export const columns = (
    setIsModalOpen: (open: boolean) => void,
    setEditModalOpen: (open: boolean) => void,
    setSelectedCarousel: (carousel: Carousel | null) => void
): ColumnDef<Carousel>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const imageName = row.getValue("image") as string;
            const imageUrl = `/carousel/${imageName}`;
            return (
                <img
                    src={imageUrl}
                    alt="Carousel"
                    className="w-16 h-16 object-cover"
                />
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const carousel = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleDelete(carousel.id)}>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedCarousel(carousel);
                                setEditModalOpen(true);
                            }}
                        >
                            Update
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
