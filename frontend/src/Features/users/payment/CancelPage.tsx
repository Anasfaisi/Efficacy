const CancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-4 text-lg">Your subscription wasn’t completed.</p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Try Again
      </a>
    </div>
  );
};

export default CancelPage;
