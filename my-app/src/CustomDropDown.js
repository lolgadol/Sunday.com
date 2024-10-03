import { useState } from "react"
function CustomDropDown({ items, title, setState }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {items.map((item) => (
            <li
              key={item}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setState(item)
                setIsOpen(false)
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default CustomDropDown;