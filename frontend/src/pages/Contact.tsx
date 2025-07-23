import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="text-center mb-8 max-w-md">
        <p className="text-lg text-gray-600 mb-4">
          Get in touch with us! We'd love to hear from you.
        </p>
        <div className="space-y-2 text-gray-600">
          <p>📧 Email: contact@example.com</p>
          <p>📞 Phone: (555) 123-4567</p>
          <p>📍 Address: 123 Main St, City, State</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/about">Go to About</Link>
        </Button>
      </div>
    </div>
  );
}

export default Contact;
