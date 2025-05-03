import { Mail, Check } from 'lucide-react';
import priority from '@/assets/priority.jpg';

export default function Feature_1() {
  return (
    <>
      {/* Feature 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Mail className="h-4 w-4" />
            <span>Priority Classification</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Know what&apos;s urgent
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Your inbox finally knows what&apos;s urgent. Our AI auto-tags
            high-priority messages, so you can take action where it matters
            most—no manual sorting needed.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Automatic priority tagging</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Focus on what matters most</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Never miss important emails</span>
            </li>
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden border shadow-lg">
          <img
            src="./bg.jpg"
            style={{ position: 'absolute', top: 0, left: 0 }}
            alt="Priority classification feature"
            className="object-cover w-full h-full"
          />
          <img src={priority} alt="" className='absolute w-6/10 rounded-t-md -bottom-20 max-sm:bottom-0 left-1/2 -translate-x-1/2' />
        </div>
      </div>
    </>
  );
}
