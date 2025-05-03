import { Mail, Check } from 'lucide-react';
import categories from '@/assets/categories.jpg';

export default function Feature_2() {
  return (
    <>
      {/* Feature 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
        <div className="space-y-6 text-left md:order-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Mail className="h-4 w-4" />
            <span>Smart Grouping</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Intelligent email organization
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Meet your new folders—smarter, dynamic, and always up-to-date. Our
            agent groups emails into categories like Work, Newsletters, Bills,
            and More.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Automatic email categorization</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Dynamic folder organization</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <span>Always up-to-date categories</span>
            </li>
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden border shadow-lg md:order-1">
          <img
            src="./bg.jpg"
            alt="Smart email grouping feature"
            className="object-cover w-full  h-full"
          />
          <img
            src={categories}
            alt=""
            className="absolute w-6/10 rounded-t-md -bottom-0 max-sm:bottom-0 left-1/2 -translate-x-1/2"
          />
        </div>
      </div>
    </>
  );
}
