import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
export default function Hero() {
	const navigate = useNavigate()
	const goSignUp = ()=>{
		navigate('/auth/sign-up')
	}
  return (
    <>
      <section className='container  space-y-8 '>
        <div className='relative w-full h-[600px] rounded-lg overflow-hidden border shadow-xl mt-12 '>
          <img
            src='./bg.jpg'
            alt='Email dashboard interface'
            className='object-cover h-full w-full -z-10'
          />

          <div className='absolute top-1/2 left-1/2 -translate-1/2 w-full flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto z-30'>
            <div className='inline-block rounded-full bg-muted px-3 py-1 text-sm'>
              <span className='font-medium'>EmailAI is now available</span>
            </div>
            <h1 className='text-3xl uppercase md:text-6xl font-bold leading-tight tracking-tighter'>
              Tame the Chaos of Your Inbox with AI Precision
            </h1>
            <p className='text-sm px-3 sm:text-xl text-accent-foreground max-w-2xl'>
              Drowning in emails? Let our smart agent handle the
              clutter—organize, summarize, and reply in seconds. Reclaim your
              time and peace of mind.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Button size='lg' className='gap-2' onClick={goSignUp}>
                Get Started Now
                <ArrowRight className='h-4 w-4' />
              </Button>
              <Button size='lg' variant='outline' className='gap-2'>
                Learn More
              </Button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
