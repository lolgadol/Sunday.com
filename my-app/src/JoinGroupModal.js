import { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserContext } from './UserContext';

export default function JoinGroupModal({ show, setShow, setEndEdit }) {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const {user,setUser} = useUserContext();

  const handleClose = () => {
    setShow(false);
    setGroupName('');
    setError(null);
  };

  async function joinGroupButton() {
    if (user.group) {
      setError("You're already in a group.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/joinGroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, groupName }),
      });
      if (response.ok) {
        const responseJson = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          group: responseJson.group,
        }));
        handleClose();
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to join group");
      }
    } catch (err) {
      console.log(err.message);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!show) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={modalVariants}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Join Group</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={joinGroupButton}
            disabled={isLoading || !groupName.trim()}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading || !groupName.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Joining...' : 'Join Group'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}