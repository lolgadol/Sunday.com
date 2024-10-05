import React, { useState, useEffect } from 'react'
import { useUserContext } from "./UserContext"
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import ContextMenu from './ContextMenu'
import UpdateModal from './UpdateModal'

export default function TaskTable() {
  const [tablePosition, setTablePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState({ name: "name", status: "status", priority: "priority", dueDate: "dueDate" })
  const [tasksTable, setTasksTable] = useState([])
  const [groupTasksTable, setGroupTasksTable] = useState([])
  const [show, setShow] = useState(false)
  const [endEdit, setEndEdit] = useState(false)
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  const { user } = useUserContext()
  const navigate = useNavigate()

  function updateTable() {
    setTasksTable((prevTasks) => prevTasks.filter(task => task._id !== selectedTask._id))
    setGroupTasksTable((prevTasks) => prevTasks.filter(task => task._id !== selectedTask._id))
  }

  function onRowRightClick(event, task) {
    event.preventDefault()
    setTablePosition({ x: event.clientX, y: event.clientY })
    setIsVisible(true)
    setSelectedTask(task)
  }

  function onRowClick(event) {
    event.stopPropagation()
    if (isVisible) {
      setIsVisible(false)
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  useEffect(() => {
    console.log('ended editing')
    fetch('http://localhost:5000/tasks/' + user._id)
      .then(response => response.json())
      .then(data => {
        setTasksTable(data.map(task => ({
          ...task,
          workingOnIt: ["me"]
        })))
      })
      .catch(error => console.error('Error fetching data:', error))

    fetch('http://localhost:5000/tasks/' + user.group)
      .then(response => response.json())
      .then(data => {
        data.forEach(task => {
          task.workingOnIt.forEach(async (worker, index) => {
            try {
              const response = await fetch("http://localhost:5000/user/" + worker, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
              })
              if (response.ok) {
                const responseJson = await response.json()
                task.workingOnIt[index] = responseJson.user.username
                setGroupTasksTable([...data])
              }
            } catch (error) {
              console.error('Error fetching user data:', error)
            }
          })
        })
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [endEdit, user.group, user._id])

  useEffect(() => {
    document.addEventListener('click', onRowClick)
    return () => {
      document.removeEventListener('click', onRowClick)
    }
  }, [isVisible])

  const allTasks = [...tasksTable, ...groupTasksTable]
  const sortedTasks = allTasks.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Task Table</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Name', 'Status', 'Priority', 'Due Date', 'Working on task'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase())}
                >
                  <div className="flex items-center">
                    {header}
                    {sortColumn === header.toLowerCase() && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-50 transition-colors duration-200"
                onContextMenu={(e) => onRowRightClick(e, task)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.workingOnIt.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRowRightClick(e, task)
                    }}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContextMenu
        setShow={setShow}
        onClick={updateTable}
        options={["update", "delete"]}
        xPos={tablePosition.x}
        yPos={tablePosition.y}
        visible={isVisible}
        task={selectedTask}
      />
      <UpdateModal
        setEndEdit={setEndEdit}
        show={show}
        setShow={setShow}
        task={selectedTask}
      />
    </div>
  )
}