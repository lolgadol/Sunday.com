import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'


export default function MultiSelectDropdown({
  selectedOptions,
  setSelectedOptions,
  show,
  setShow,
  options
}){

  const handleToggle = () => {
    console.log(options);
    setShow(!show)
  }

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option)
      } else {
        return [...prevSelected, option]
      }
    })
  }

  return (
    <div className="relative w-64">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className="block truncate">
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : 'Select Options'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              show ? 'transform rotate-180' : ''
            }`}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          >
            {options.map((option) => (
              <motion.div
                key={option}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className="flex items-center px-4 py-2 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
                {selectedOptions.includes(option) && (
                  <Check className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}