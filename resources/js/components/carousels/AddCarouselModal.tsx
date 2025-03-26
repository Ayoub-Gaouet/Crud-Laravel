import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddCarouselModal = ({
                              isOpen,
                              onClose,
                          }: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (!csrfToken) {
            setMessage({
                type: "error",
                text: "CSRF token missing! Refresh the page.",
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }
        formData.append("status", status);

        try {
            const response = await fetch("/carousels", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "same-origin",
                body: formData,
            });

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Carousel added successfully!",
                });

                setTitle("");
                setDescription("");
                setImage(null);
                setStatus("");

                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1500);
            } else {
                const errorData = await response.json();
                setMessage({
                    type: "error",
                    text: errorData.message || "Failed to add carousel.",
                });
            }
        } catch (error) {
            console.error("Error adding carousel:", error);
            setMessage({
                type: "error",
                text: "An error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Carousel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {message && (
                        <div
                            className={`p-2 rounded ${
                                message.type === "success"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                    <Input
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <Input
                        type="file"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Add Carousel"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCarouselModal;
