import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Payment, columns } from "@/components/payments/columns";
import { DataTable } from "@/components/payments/data-table";
import { useEffect, useState } from 'react';
import EditPaymentModel from "@/components/payments/EditPaymentModal";
import AddPaymentModel from "@/components/payments/AddPaymentModal";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: '/payments',
    },
];

export default function Posts({ payments }: { payments: Payment[] }) {
    const [data, setData] = useState<Payment[]>(payments);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    useEffect(() => {
        setData(payments);
    }, [payments]);

    const handleUpdate = (updatedPayment: Payment) => {
        setData((prevData: Payment[]) =>
            prevData.map((payment: Payment) => (payment.id === updatedPayment.id ? updatedPayment : payment))
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedPayment)} data={data} />
            </div>

            <EditPaymentModel isOpen={editModelOpen} onClose={() => setEditModalOpen(false)}
                              payment={selectedPayment}
                              onUpdate={handleUpdate} />

            <AddPaymentModel isOpen={isModelOpen} onClose={() => setIsModalOpen(false)} />
        </AppLayout>
    );
}
