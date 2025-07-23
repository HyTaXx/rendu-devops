import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Home Page
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        This is the home page of your React application with routing enabled.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild>
          <Link to="/about">Go to About</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Go to Contact</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/api-demo">Try API Demo</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
