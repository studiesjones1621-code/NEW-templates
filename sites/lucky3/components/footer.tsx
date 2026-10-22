import { business, fullAddress } from "@/lib/business"
import { Wordmark } from "./header"

export function Footer() {
  return (
    <footer className="bg-[oklch(0.22_0.025_235)] text-primary-foreground/80 py-12">
      <div className="container mx-auto px-5 md:px-8 flex flex-col md:flex-row gap-8 md:items-end justify-between">
        <div>
          <Wordmark className="text-primary-foreground" />
          <p className="mt-4 text-sm max-w-sm">{business.tagline} Dog & cat grooming by appointment at {fullAddress}.</p>
        </div>
        <div className="text-sm md:text-right space-y-1">
          <p>
            <a href={business.phoneHref} className="hover:text-marigold">
              {business.phoneDisplay}
            </a>
          </p>
          <p className="text-primary-foreground/50">
            © {new Date().getFullYear()} {business.fullName}. Grooming footage and dog clip: Mixkit (free license). Bark: &ldquo;Labrador Barking Dog&rdquo; by Daniel Simion, SoundBible, CC BY 3.0.
          </p>
        </div>
      </div>
    </footer>
  )
}
