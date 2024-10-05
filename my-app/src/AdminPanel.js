import { useEffect, useState } from "react"
import { useUserContext } from "./UserContext"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function AdminPanel() {
  const [group, setGroup] = useState({})
  const [groupMembers, setGroupMembers] = useState([])
  const [groupTasks, setGroupTasks] = useState([])
  const { user } = useUserContext()
  const navigate = useNavigate()

  function getTasks() {
    fetch('http://localhost:5000/tasks/' + user.group)
      .then(response => response.json())
      .then(data => {
        data.map(task => {
          task.workingOnIt.map(async (worker, index) => {
            const response = await fetch("http://localhost:5000/user/" + worker, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
              const responseJson = await response.json()
              task.workingOnIt[index] = responseJson.user.username
              setGroupTasks([...data])
            }
          })
        })
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  async function getGroup() {
    const response = await fetch("http://localhost:5000/getGroup/" + user.group, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
      const responseJson = await response.json()
      setGroup(responseJson)
      await getMembers()
      getTasks()
    }
  }

  async function getMembers() {
    const response = await fetch("http://localhost:5000/group/" + user.group, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
      const responseJson = await response.json()
      setGroupMembers(responseJson)
      console.log(groupMembers)
    }
  }

  useEffect(() => {
    getGroup()
  }, [user])

  async function kickButton(user) {
    const response = await fetch("http://localhost:5000/leaveGroup", {
      method: "POST",
      body: JSON.stringify({ userId: user._id }),
      headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
      alert("user " + user.username + " has been kicked")
      setGroupMembers(groupMembers.filter(member => member._id !== user._id))
    } else {
      alert("An error occurred while kicking the user")
    }
  }

  async function promoteButton(member) {
    const response = await fetch("http://localhost:5000/promote", {
      method: "POST",
      body: JSON.stringify({ newAdmin: member }),
      headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
      alert("User promoted successfully")
      navigate("/home")
    } else {
      alert("An error occurred while promoting the user")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <h2 className="text-2xl font-semibold mb-6">Manage {group.name}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working on</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manage member</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupMembers.map((member, index) => (
              <motion.tr
                key={member._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{member.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {groupTasks
                    .filter(task => task.workingOnIt.includes(member.username))
                    .map(task => task.name)
                    .join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => promoteButton(member)}
                  >
                    Promote to Admin
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => kickButton(member)}
                  >
                    Kick from group
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}