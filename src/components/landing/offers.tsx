import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export function Offers() {
    return (
        <div className="bg-muted relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Pricing that scale with your business</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-lg">Choose the perfect plan for your needs and start optimizing your workflow today</p>
                </div>
                <div className="mt-8 md:mt-16">
                    <Card className="relative">
                        <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-semibold">Suite Enterprise</h3>
                                <p className="mt-2 text-lg">For your company of any size</p>
                                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                                    <span className="text-4xl">$</span>234
                                </span>
                                 <div className="flex justify-center">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#">Get started</Link>
                                    </Button>
                                </div>
                                 <p className="text-muted-foreground mt-12 text-sm">Includes : Security, Unlimited Storage, Payment, Search engine, and all features</p>
                            </div>
                            <div className="relative">
                                <ul
                                    role="list"
                                    className="space-y-4">
                                    {['First premium advantage', 'Second advantage weekly', 'Third advantage donate to project', 'Fourth, access to all components weekly'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-sm">Team can be any size, and you can add or switch members as needed. Companies using our platform include:</p>
                                <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
                                    <img
                                        className="h-5 w-fit"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        height="20"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit"
                                        src="https://html.tailus.io/blocks/customers/column.svg"
                                        alt="Column Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit"
                                        src="https://html.tailus.io/blocks/customers/github.svg"
                                        alt="GitHub Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-5 w-fit"
                                        src="https://html.tailus.io/blocks/customers/nike.svg"
                                        alt="Nike Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}