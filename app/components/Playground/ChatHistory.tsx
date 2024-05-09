/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ZcnqvgNQ6xr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div key="1" className="relative flex flex-col h-full max-w-5xl mx-auto my-6 space-y-5">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-white border rounded-lg shadow-sm ml-2">
            <p className="text-gray-800">What are the trending memecoins today?</p>
          </div>
        </div>
        <div className="flex items-start flex-row-reverse">
          <Avatar>
            <AvatarImage alt="AI Avatar" src="/placeholder-ai-avatar.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-black text-white border rounded-lg shadow-sm mr-2">
            <p className="text-gray-200">
              Some of the trending memecoins today include Dogecoin (DOGE), Shiba Inu (SHIB), and Dogelon Mars (ELON).
              However, it's important to remember that memecoins are highly speculative and volatile, so please do your
              own research before investing.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-white border rounded-lg shadow-sm ml-2">
            <p className="text-gray-800">What is the price of $DOGE right now?</p>
          </div>
        </div>
        <div className="flex items-start flex-row-reverse">
          <Avatar>
            <AvatarImage alt="AI Avatar" src="/placeholder-ai-avatar.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-black text-white border rounded-lg shadow-sm mr-2">
            <p className="text-gray-200">According to CoinGecko, the current price of Dogecoin (DOGE) is $0.07 USD.</p>
          </div>
        </div>
        <div className="flex items-start">
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-white border rounded-lg shadow-sm ml-2">
            <p className="text-gray-800">I would like to buy 42 $DOGE</p>
          </div>
        </div>
        <div className="flex items-start flex-row-reverse">
          <Avatar>
            <AvatarImage alt="AI Avatar" src="/placeholder-ai-avatar.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="p-4 bg-black text-white border rounded-lg shadow-sm mr-2">
            <p className="text-gray-200">
              To buy 42 DOGE at the current price of $0.07 USD, you would need to spend approximately $2.94 USD.
              However, I would recommend doing your own research and only investing what you can afford to lose, as
              memecoins are highly speculative and volatile.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
        <Input className="flex-1 mx-4" placeholder="Send a message." />
        <Button className="p-3 bg-gray-200 rounded-md">
          <PlaneIcon className="w-6 h-6 text-gray-700" />
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