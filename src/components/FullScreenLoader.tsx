import { Spinner } from "./ui/spinner";

const FullScreenLoader = ({ message }: { message?: string }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <Spinner>{message && <span>{message}</span>}</Spinner>
    </div>
  );
};

export default FullScreenLoader;
