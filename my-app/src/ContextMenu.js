import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UpdateManager from "./UpdateManager";
import UpdateModal from "./UpdateModal";

export default function ContextMenu({ options, xPos, yPos, visible, task, onClick, setShow }) {
  function clickOption(option) {
    if (option === "update") {
      setShow(true);
    } else if (option === "delete") {
      console.log("deleted");
      UpdateManager.delete(task);
      onClick();
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="context-menu"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        style={{
          position: "absolute",
          top: `${yPos}px`,
          left: `${xPos}px`,
          zIndex: 1000,
        }}
        className="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
      >
        {options.map((option, index) => (
          <motion.button
            key={option}
            initial={{ backgroundColor: "#ffffff" }}
            whileHover={{ backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => clickOption(option)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}