/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QlwEb7i0WZI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div key="1" className="relative flex flex-col h-full max-w-5xl mx-auto my-6 space-y-5">
      <div className="p-4 sm:p-6 bg-white border rounded-lg shadow-sm mb-52">
      <h1 className="text-xl sm:text-2xl font-bold">Welcome to Next.js AI Chatbot!</h1>
        <p className="mt-2 text-gray-600">
          This is an open source AI chatbot app template built with Next.js, the Vercel AI SDK, and Vercel KV. It uses
          React Server Components to combine text with generative UI as output of the LLM. The UI state is synced
          through the SDK so the model is aware of your interactions as they happen.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-800">What are the trending memecoins today?</p>
        </div>
        <div className="p-4 sm:p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-800">What is the price of $DOGE right now?</p>
        </div>
        <div className="p-4 sm:p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-800">I would like to buy 42 $DOGE</p>
        </div>
        <div className="p-4 sm:p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-800">What are some recent events about $DOGE?</p>
        </div>
      </div>
      <div className="flex items-center p-3 sm:p-4 bg-white border rounded-lg shadow-sm">
      <Input className="flex-1 mx-2 sm:mx-4" placeholder="Send a message." />
      <Button className="p-2 sm:p-3 bg-gray-200 rounded-md">
      <PlaneIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700" />
        </Button>
      </div>
    </div>
  )
}

function PlaneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  )
}