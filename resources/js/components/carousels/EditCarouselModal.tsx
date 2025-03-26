import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel } from "@/components/carousels/columns"; // Update this import path if needed

interface EditCarouselModalProps {
    isOpen: boolean;
    onClose: () => void;
    carousel: Carousel | null;
    onUpdate: (updatedCarousel: Carousel) => void;
}

const EditCarouselModal: React.FC<EditCarouselModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 carousel,
                                                                 onUpdate,
                                                             }) => {
    const [formData, setFormData] = useState<Carousel>({
        id: "",
        title: "",
        description: "",
        image: "",
        status: "active",
    });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (carousel) {
            setFormData(carousel);
        }
    }, [carousel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

        if (!csrfToken) {
            setMessage({ type: "error", text: "CSRF token missing! Refresh the page." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/carousels/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "same-origin",
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedCarousel = await response.json();
                setMessage({ type: "success", text: "Carousel updated successfully!" });
                onUpdate(updatedCarousel);
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1500);
            } else {
                const errorData = await response.json();
                setMessage({ type: "error", text: errorData.message || "Failed to update carousel." });
            }
        } catch (error) {
            console.error("Error updating carousel:", error);
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Carousel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {message && (
                        <div
                            className={`p-2 rounded ${
                                message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        required
                    />
                    <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        required
                    />
                    <Input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        required
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Carousel"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCarouselModal;
