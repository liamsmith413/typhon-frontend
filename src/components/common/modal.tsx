"use client";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from "../ui/dialog";
import { useModal } from "./hooks/use-modal";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "../ui/sheet";
import { cn } from "../common/utils/cn";

interface ModalProps {
    type: "dialog" | "sheet";
    className?: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    type,
    className,
    title,
    description,
    children,
}) => {
    const { isOpen, toggleModal } = useModal();

    return (
        <>
            {type === "dialog" ? (
                <Dialog open={isOpen} onOpenChange={toggleModal}>
                    <DialogContent className={cn(className)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        {children}
                    </DialogContent>
                </Dialog>
            ) : type === "sheet" ? (
                <Sheet open={isOpen} onOpenChange={toggleModal}>
                    <SheetContent className={cn(className)}>
                        <SheetHeader>
                            <SheetTitle>{title}</SheetTitle>
                            <SheetDescription>{description}</SheetDescription>
                        </SheetHeader>
                        {children}
                    </SheetContent>
                </Sheet>
            ) : null}
        </>
    );
};