"use client"
import { useEffect, useState } from "react"
import type { Event, UpdateEventFunction } from "../lib/types/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateEvent: UpdateEventFunction;
    deleteEvent: (eventId: number) => Promise<void>;
    event: Event;
}

const UpdateEventModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, updateEvent, deleteEvent, event }) => {
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [startDate, setStartDate] = useState(event.startDate);
    const [endDate, setEndDate] = useState(event.endDate);
    const { toast } = useToast();

    useEffect(() => {
        setTitle(event.title);
        setDescription(event.description);
        setStartDate(event.startDate);
        setEndDate(event.endDate);
    }, [event])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEvent(event.id, {
                title,
                description,
                startDate,
                endDate
            });
            toast({
                title: "成功",
                description: "イベントが更新されました。",
                variant: "success"
            });
            onClose();
        } catch (error) {
            console.error("イベント更新中にエラーが発生しました", error);
            toast({
                title: "エラー",
                description: "イベントの更新に失敗しました。",
                variant: "destructive",
            });
        }
    }

    const handleDelete = async () => {
        if (window.confirm("このイベントを削除してもよろしいですか？")) {
            try {
                await deleteEvent(event.id);
                toast({
                    title: "成功",
                    description: "イベントが削除されました。",
                    variant: "success"
                });
                onClose();
            } catch (error) {
                console.error("イベント削除中にエラーが発生しました", error);
                toast({
                    title: "エラー",
                    description: "イベントの削除に失敗しました。",
                    variant: "destructive",
                });
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>イベントを更新</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                タイトル
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                説明
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                開始日
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                                終了日
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            イベントを更新
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            削除
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateEventModal;