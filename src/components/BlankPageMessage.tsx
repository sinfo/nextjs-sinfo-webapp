export default function BlankPageWithMessage({ message }: { message: string }) {
  return (
    <div className="w-full text-center mx-auto text-gray-800 p-5">
      {message}
    </div>
  );
}
