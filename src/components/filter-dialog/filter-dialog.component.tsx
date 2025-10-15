import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { Fragment, type FC, type PropsWithChildren } from "react";

interface IGSADialog extends PropsWithChildren {
  id?: string;
  isOpen: boolean;
  setOpen: (is: boolean) => void;
}
const GSADialog: FC<IGSADialog> = ({ id, isOpen, setOpen, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment} key={id}>
      <Dialog
        id={id}
        as="div"
        className="relative z-50"
        onClose={setOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-dialog-title"
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <DialogPanel
              className="
                w-full sm:max-w-lg sm:rounded-xl sm:my-8 
                bg-white shadow-xl rounded-t-2xl
                transform transition-all
              "
            >
              {children}
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GSADialog;
