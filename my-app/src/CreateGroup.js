import { useState } from "react"
import { motion } from "framer-motion"
import { useUserContext } from './UserContext'
import { useNavigate } from "react-router-dom"

export default function CreateGroup() {
  const [name, setName] = useState("")
  const { user, setUser } = useUserContext()
  const navigate = useNavigate()

  async function createGroupButton() {
    const response = await fetch("http://localhost:5000/group", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ groupName: name, adminId: user._id })
    })
    if (response.ok) {
      alert("Group created successfully!")
      const responseJson = await response.json()
      setUser((user) => ({
        ...user,
        group: responseJson.newGroup._id
      }))
      navigate("/home")
    } else {
      const responseJson = await response.json()
      alert(responseJson.msg)
    }
  }

  async function leaveGroupButton() {
    const response = await fetch("http://localhost:5000/leaveGroup", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ userId: user._id })
    })

    if (response.ok) {
      const responseJson = await response.json()
      alert(responseJson.msg)
      navigate("/home")
      setUser((user) => ({
        ...user,
        group: ""
      }))
      alert(user.group)
    } else {
      const responseJson = await response.json()
      alert(responseJson.msg)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-center text-gray-800 underline"
        >
          CREATE GROUP
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Group Name"
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              onClick={() => createGroupButton()}
            >
              Create Group
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
              onClick={() => leaveGroupButton()}
            >
              Leave Group
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}