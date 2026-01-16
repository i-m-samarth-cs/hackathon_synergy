import serverless from "serverless-http";
import { createServer } from "../server";

// Export the handler for Vercel serverless functions
export default serverless(createServer());
