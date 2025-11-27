export default function Maintenance() {
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg text-center border border-rose-100">
        <h1 className="text-4xl font-extrabold text-rose-700 mb-4">
          We’ll Be Right Back
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Our site is temporarily down for maintenance.<br />
          We’re working hard to restore everything as quickly as possible.
        </p>

        <div className="animate-pulse text-rose-500 font-semibold">
          Checking system status…
        </div>
      </div>
    </div>
  );
}
