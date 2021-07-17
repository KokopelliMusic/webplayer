const Connect = () =>
<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8">
    <div>
      <img
        className="mx-auto h-20 w-auto"
        src="./kokopelli.png"
        alt="Workflow"
      />
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to Kokopelli
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Please fill in your session code below
      </p>
    </div>
    <form className="mt-8 space-y-6" action="player">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="code" className="sr-only">
            Session code
          </label>
          <input
            id="code"
            name="code"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Session code"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect
        </button>
      </div>
    </form>
  </div>
</div>


export default Connect;
