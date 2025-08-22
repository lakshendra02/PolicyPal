import FileUpload from "../components/FileUpload";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Upload Your Insurance Policy</h1>
      <FileUpload />
    </div>
  );
}
