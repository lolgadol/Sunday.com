
import { useState } from "react"
import { useUserContext } from "./UserContext"
import CustomDropDown from "./CustomDropDown"
import { useNavigate } from "react-router-dom"

const priorities = ["low", "medium", "high"]
const statuses = ["done", "working on it", "stuck", "other"]
const taskTypes = ["personal", "group"]

export default function CreateTask() {
  const { user } = useUserContext()
  const [name, setName] = useState("")
  const [priority, setPriority] = useState("priority")
  const [status, setStatus] = useState("status")
  const [dueDate, setDueDate] = useState("")
  const [taskPersonal, setTaskPersonal] = useState("personal")

  const navigate = useNavigate()

  const createTaskButton = async () => {
    if (!name || priority === "priority" ||  status === "status" || !dueDate) {
      alert("Please fill in all fields")
      return
    }

    const endpoint = taskPersonal === "personal" ? "/task" : "/groupTask"
    const body =
      taskPersonal === "personal"
        ? { creator_id: user._id, name, priority, status, dueDate }
        : { creator_id: user._id, group_id: user.group, name, priority, status, dueDate,user_id: user._id }

    if (taskPersonal === "group" && !user.group) {
      alert("You are not part of any group")
      return
    }

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        alert("Task created successfully")
        navigate("/home")
      } else {
        alert("Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("An error occurred while creating the task")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-lg">
        <div className="md:flex">
          <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-900">Create Task</h1>
            <div className="space-y-4">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                placeholder="Due date"
                onChange={(e) => setDueDate(e.target.value)}
              />
              <CustomDropDown items={priorities} title={priority} setState={setPriority} />
              <CustomDropDown items={statuses} title={status} setState={setStatus} />
              <CustomDropDown items={taskTypes} title={taskPersonal} setState={setTaskPersonal} />
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={createTaskButton}
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}