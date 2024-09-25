"use client"
import { useState } from "react"
import type{ EventProps } from "../lib/types/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

interface Event extends EventProps {
    id: number;
    created_at: string;
    updated_at: string;
}

type CreateEventFunction = (calendarUd: number, params: EventProps) => Promise<ApiResponse<Event>>

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    createEvent: CreateEventFunction;
    calendarId: number;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, createEvent, calendarId}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEvent(calendarId, {
                title,
                description,
                startDate,
                endDate
            });
            clearEvent();
            onClose();
        } catch (error) {
            console.error("イベント作成中にエラーが発生しました");
        }
    }

    const clearEvent = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>イベントを追加</DialogTitle>
            </DialogHeader>
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
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                イベントを追加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
}

export default CreateModal
