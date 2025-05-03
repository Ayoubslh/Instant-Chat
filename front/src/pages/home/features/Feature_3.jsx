import { Mail, Check } from 'lucide-react';
import summary from '@/assets/summary.jpg';
export default function Feature_3() {
  return (
    <>
      {/* Feature 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Mail className="h-4 w-4" />
            <span>Email Summaries</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Get the gist instantly
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            No time to read 12 paragraphs? Our AI summarizes your messages at a
            glance, so you always know what&apos;s inside—fast.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Instant email summaries</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Save time reading emails</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Focus on what matters</span>
            </li>
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden border shadow-lg">
          <img
            src="./bg.jpg"
            alt="Email summary feature"
            className="object-cover w-full  h-full"
          />
          <img
            src={summary}
            alt=""
            className="absolute w-8/10 rounded-md top-1/2 left-1/2 -translate-1/2"
          />
        </div>
      </div>
    </>
  );
}
