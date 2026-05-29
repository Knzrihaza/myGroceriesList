import {
  ShieldCheckIcon, ZapIcon, GlobeIcon, StarIcon, HeartIcon, LockIcon,
  CheckCircleIcon, ArrowRightIcon, BarChart2Icon, UsersIcon, CreditCardIcon,
  BellIcon, CameraIcon, ClockIcon, CloudIcon, CodeIcon, CompassIcon,
  DatabaseIcon, DownloadIcon, GiftIcon, HelpCircleIcon, HomeIcon,
  InboxIcon, LayersIcon, LeafIcon, LinkIcon, MapIcon, MessageSquareIcon,
  MusicIcon, PhoneIcon, SearchIcon, SendIcon, SettingsIcon, ShareIcon,
  ShoppingCartIcon, SmileIcon, ThumbsUpIcon, TrendingUpIcon, TrophyIcon,
  RotateCcwIcon, SparklesIcon, TagIcon, MoonIcon,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { FeatureItem } from '@/lib/types'

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  ShieldCheck: ShieldCheckIcon, Zap: ZapIcon, Globe: GlobeIcon, Star: StarIcon,
  Heart: HeartIcon, Lock: LockIcon, CheckCircle: CheckCircleIcon,
  ArrowRight: ArrowRightIcon, BarChart2: BarChart2Icon, Users: UsersIcon,
  CreditCard: CreditCardIcon, Bell: BellIcon, Camera: CameraIcon,
  Clock: ClockIcon, Cloud: CloudIcon, Code: CodeIcon, Compass: CompassIcon,
  Database: DatabaseIcon, Download: DownloadIcon, Gift: GiftIcon,
  HelpCircle: HelpCircleIcon, Home: HomeIcon, Inbox: InboxIcon,
  Layers: LayersIcon, Leaf: LeafIcon, Link: LinkIcon, Map: MapIcon,
  MessageSquare: MessageSquareIcon, Music: MusicIcon, Phone: PhoneIcon,
  Search: SearchIcon, Send: SendIcon, Settings: SettingsIcon, Share: ShareIcon,
  ShoppingCart: ShoppingCartIcon, Smile: SmileIcon, ThumbsUp: ThumbsUpIcon,
  TrendingUp: TrendingUpIcon, Trophy: TrophyIcon,
  RotateCcw: RotateCcwIcon, Sparkles: SparklesIcon, Tag: TagIcon, Moon: MoonIcon,
}

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICON_MAP[name] ?? HelpCircleIcon
  return <Icon {...props} />
}

export function LandingFeatures({
  title,
  subtitle,
  items,
  columns = 3,
}: {
  title?: string
  subtitle?: string
  items: FeatureItem[]
  columns?: 2 | 3 | 4
}) {
  const gridClass =
    columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        {(title || subtitle) && (
          <div className="text-center mb-14">
            {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className={`grid gap-8 ${gridClass}`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'color-mix(in oklch, var(--color-primary) 15%, transparent)' }}
              >
                <DynamicIcon
                  name={item.icon}
                  className="size-5"
                  style={{ color: 'var(--color-primary)' }}
                />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
