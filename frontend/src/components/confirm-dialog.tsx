"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { useCallback, useState } from "react";

export function ConfirmDialogWithTrigger({
  actionFn,
  title,
  description,
  children,
  ...props
}: {
  actionFn: () => Promise<void>;
  title: string;
  description: string;
} & ButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={props.disabled} onClick={actionFn}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ConfirmDialog({
  onOpen,
  actionFn,
  cancelFn,
  title,
  description,
  children,
  ...props
}: {
  onOpen?: () => void;
  actionFn: () => Promise<void>;
  cancelFn?: () => void;
  title: string;
  description: string;
} & ButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOnClick = useCallback(() => {
    if (onOpen) onOpen();
    setOpen(true);
  }, [onOpen]);

  return (
    <>
      <Button {...props} onClick={handleOnClick}>
        {children}
      </Button>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                if (cancelFn) cancelFn();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={props.disabled}
              onClick={async () => {
                await actionFn();
                setOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
