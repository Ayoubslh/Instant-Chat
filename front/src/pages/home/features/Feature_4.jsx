import { Mail, Check } from 'lucide-react';
import replay from '@/assets/replay.jpg';
export default function Feature_4() {
  return (
    <>
      {/* Feature 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
        <div className="space-y-6 text-left md:order-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Mail className="h-4 w-4" />
            <span>Smart Replies</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Reply with one click
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Never type &quot;Sure, sounds good!&quot; again. Our AI drafts
            replies tailored to the message, ready for your review and send.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>AI-generated reply suggestions</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>One-click responses</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Personalized to each email</span>
            </li>
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden border shadow-lg md:order-1">
          <img
            src="./bg.jpg"
            alt="AI reply suggestions feature"
            className="object-cover w-full  h-full"
          />
          <img
            src={replay}
            alt=""
            className="absolute w-8/10 rounded-md top-1/2 left-1/2 -translate-1/2"
          />
        </div>
      </div>
    </>
  );
}
