'use client';

import { Dialog, DialogBackdrop, DialogPanel, Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import applications from "../../utils/applications.json";
import { SelectBox } from "../multi-select/multi-select.component";
import { PeriodFilter } from "../period-filter/period-filter.component";
import { CeilingFilter } from "../ceiling-filter/ceiling-filter.component";

const GSADialog = ({ isOpen, setOpen, children }) => {
  const vehicles = useMemo(
    () => Array.from(new Set(applications.map((item) => item.vehicle))),
    []
  );
  const agency = useMemo(
    () => Array.from(new Set(applications.map((item) => item.agency))),
    []
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
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

        {/* Bottom Sheet Container */}
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
              {/* Header Bar (drag handle style) */}
             {children}
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GSADialog;
