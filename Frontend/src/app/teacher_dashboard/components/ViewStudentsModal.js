const ViewStudentsModal = ({ isOpen, onClose, students }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
          <button onClick={onClose} className="text-gray-500 float-right">
            &times;
          </button>
          <h3 className="text-lg mb-4">Students in Class</h3>
          <div className="overflow-y-auto max-h-60">
            <ul>
              {students.map((student) => (
                <li key={student._id} className="flex justify-between py-2">
                  <span className="text-gray-700">{student.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  