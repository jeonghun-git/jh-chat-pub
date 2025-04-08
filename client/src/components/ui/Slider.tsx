import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '~/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { onDoubleClick?: () => void }
    >(({ className, onDoubleClick, ...props }, ref) => (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full cursor-pointer touch-none select-none items-center',
          className,
        )}
        onDoubleClick={onDoubleClick}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-700/90 shadow-md">
          <SliderPrimitive.Range className="absolute h-full bg-gray-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-gray-800/10 bg-sky-600 shadow-md ring-0 transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    ));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
