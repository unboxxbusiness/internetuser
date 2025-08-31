import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CTA() {
  return (
    <section className="bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Stay Updated
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
          Get the latest news and offers delivered to your inbox.
        </p>
        <form className="mt-8 max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="flex-1 w-full min-w-0 resize-none overflow-hidden rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 border-none bg-white h-12 placeholder:text-slate-500 px-4 text-base"
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              variant="accent"
              className="flex items-center justify-center rounded-md h-12 px-6 bg-accent text-accent-foreground text-base font-bold tracking-wide shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-primary transition-all"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
