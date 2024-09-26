import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContentProps } from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons?: IDialogButton[];
  dialogProps?: {
    DialogContentProps?: DialogContentProps;
    DialogHeaderProps?: React.HTMLAttributes<HTMLDivElement>;
    DialogFooterProps?: React.HTMLAttributes<HTMLDivElement>;
  };
}

interface IDialogButton extends ButtonProps {
  title: string;
  action: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  buttons,
  dialogProps,
}: IProps) => {
  return (
    <Dialog
      modal={true}
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        {...(dialogProps?.DialogContentProps || {})}
        className="max-w-[90%] sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-2">
            {buttons?.map(({ title, action, className, ...rest }) => {
              return (
                <Button
                  onClick={action}
                  className={twMerge("w-full", className)}
                  {...rest}
                >
                  {title}
                </Button>
              );
            })}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
