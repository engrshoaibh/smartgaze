import { AiFillCheckCircle } from 'react-icons/ai'; // Importing the success icon

const SuccessMessage = ({ onDismiss }) => {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <AiFillCheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-2">
          Class Created Successfully!
        </h2>
        <p className="text-gray-600 text-center mb-4">
          The class has been created and assigned to the teacher.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onDismiss}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md shadow hover:from-green-600 hover:to-green-700 transition-colors duration-300"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
