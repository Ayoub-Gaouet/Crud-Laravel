import AddCarouselModel from '@/components/carousels/AddCarouselModal';
import { Carousel, columns } from '@/components/carousels/columns';
import { DataTable } from '@/components/carousels/data-table';
import EditCarouselModel from '@/components/carousels/EditCarouselModal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Carousels',
        href: '/carousels',
    },
];

export default function Posts({ carousels }: { carousels: Carousel[] }) {
    const [data, setData] = useState<Carousel[]>(carousels);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [selectedCarousel, setSelectedCarousel] = useState<Carousel | null>(null);

    useEffect(() => {
        setData(carousels);
    }, [carousels]);

    const handleUpdate = (updatedCarousel: Carousel) => {
        setData((prevData: Carousel[]) => prevData.map((carousel: Carousel) => (carousel.id === updatedCarousel.id ? updatedCarousel : carousel)));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Carousels" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedCarousel)} data={data} />
            </div>
            <EditCarouselModel isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} carousel={selectedCarousel} onUpdate={handleUpdate} />
            <AddCarouselModel isOpen={isModelOpen} onClose={() => setIsModalOpen(false)} />
        </AppLayout>
    );
}
