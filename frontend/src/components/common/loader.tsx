import React from "react";
import { Spinner } from "../ui/spinner";

function loader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Spinner className="h-12 w-12 text-black" />
      {/* <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div> */}
    </div>
  );
}

export default loader;
