import { Skeleton } from '@/components/ui/skeleton';

function InboxLoader() {
  return (
    <div className="px-3 space-y-2">
      {[1, 2, 3, 4, 5, 6].map(id => (
        <Skeleton key={id} className="w-full h-24" />
      ))}
    </div>
  );
}

export default InboxLoader;
