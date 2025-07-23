import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        This is the about page where you can learn more about our application.
        We've built this with React, TypeScript, Vite, and Tailwind CSS to
        create a modern and responsive user experience.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Go to Contact</Link>
        </Button>
      </div>
    </div>
  );
}

export default About;
