import Feature_1 from './Feature_1';
import Feature_2 from './Feature_2';
import Feature_3 from './Feature_3';
import Feature_4 from './Feature_4';

export default function Features() {
  return (
    <>
      <section id="features" className="py-24">
        <div className="container space-y-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            AI Features Built for the Modern Inbox
          </h2>
          <div className="space-y-24"></div>
          <Feature_1 />
          <Feature_2 />
          <Feature_3 />
          <Feature_4 />
        </div>
      </section>
    </>
  );
}
