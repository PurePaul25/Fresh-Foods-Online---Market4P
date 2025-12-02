import React from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { X, Megaphone, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    y: "50px",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

function AnnouncementDetailModal({ isOpen, onClose, announcement }) {
  if (!announcement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Megaphone size={20} /> Chi tiết thông báo
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {announcement.title}
              </h4>
              <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span>
                    Gửi bởi: <strong>{announcement.sentBy}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>
                    {format(new Date(announcement.sentAt), "PPP p", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none mt-4 pt-4 border-t dark:border-gray-700">
                <p>{announcement.message}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementDetailModal;
