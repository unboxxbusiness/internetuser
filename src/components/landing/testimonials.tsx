import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-lg" id="testimonials">
      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        What Our Customers Say
      </h3>

      <div className="mt-6 space-y-8">
        {/* Testimonial 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-12 shadow-sm">
              <AvatarImage src="https://picsum.photos/id/237/100/100" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">Sophia Clark</p>
              <div className="flex gap-0.5 text-primary mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
          <blockquote className="text-slate-600 dark:text-slate-400 italic">
            "Gc Fiber Net has transformed my home internet experience. The speeds are incredibly fast, and the service is reliable. Highly recommend!"
          </blockquote>
        </div>
      </div>
    </div>
  );
}
