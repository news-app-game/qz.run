"use client"

import { Separator } from "@/components/ui/separator"
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/sections/section"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { useState, useEffect, useMemo } from "react"
import { Button } from "../ui/button"
import { CheckCircle } from "@phosphor-icons/react"
import { getPackages } from "@/api/packages"

type BillingCycle = 'monthly' | 'quarterly' | 'semi_annually' | 'annually'

interface BillingCycleKey {
	label: string
	valueKey: keyof Packages.Item
	discountKey: keyof Packages.SiteConfig | ''
}
const BILLING_CYCLES: Record<BillingCycle, BillingCycleKey> = {
	monthly: {
		label: '月付',
		valueKey: 'monthly_price',
		discountKey: '',
	},
	quarterly: {
		label: '季付',
		valueKey: 'quarterly_price',
		discountKey: 'quarterly_discount',
	},
	semi_annually: {
		label: '半年付',
		valueKey: 'semi_annually_price',
		discountKey: 'semi_annually_discount',
	},
	annually: {
		label: '年付',
		valueKey: 'annually_price',
		discountKey: 'annually_discount',
	}
}
export function PriceSection() {
	const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
	const [packages, setPackages] = useState<Packages.Item[]>([])
	const [siteConfig, setSiteConfig] = useState<Packages.SiteConfig | null>(null)
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getPackages()
			setPackages(data.packages)
			setSiteConfig(data.site_config)
		}
		fetchData()
	}, [])
	useEffect(() => {
		console.log('packages', packages, siteConfig)
	}, [packages, siteConfig])

	return (
		<Section id="choose-plan">
			<SectionHeader>
				<SectionTitle>选择套餐</SectionTitle>
				<SectionDescription>根据您的需求选择合适的套餐</SectionDescription>
			</SectionHeader>
			<Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as BillingCycle)} className="items-center w-full">
				<TabsList>
					{(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((cycle) => (
						<TabsTrigger
							key={cycle}
							value={cycle}
						>
							{BILLING_CYCLES[cycle].label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value="monthly" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{packages.map((plan) => (
						<PriceCardData key={plan.id} plan={plan} tabKey={BILLING_CYCLES[billingCycle]} siteConfig={siteConfig} />
					))}
				</TabsContent>
				<TabsContent value="quarterly" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{packages.map((plan) => (
						<PriceCardData key={plan.id} plan={plan} tabKey={BILLING_CYCLES[billingCycle]} siteConfig={siteConfig} />
					))}
				</TabsContent>
				<TabsContent value="semi_annually" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{packages.map((plan) => (
						<PriceCardData key={plan.id} plan={plan} tabKey={BILLING_CYCLES[billingCycle]} siteConfig={siteConfig} />
					))}
				</TabsContent>
				<TabsContent value="annually" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{packages.map((plan) => (
						<PriceCardData key={plan.id} plan={plan} tabKey={BILLING_CYCLES[billingCycle]} siteConfig={siteConfig} />
					))}
				</TabsContent>
			</Tabs>
		</Section>
	)
}

interface PriceCardProps {
	plan: {
		name: string
		description: string
		monthlyPrice: number
		features: {
			base: string[]
			route: string[]
			others: string[]
		}
	}
	billingCycle: BillingCycle
}

function PriceCard({ plan, billingCycle }: PriceCardProps) {
	return (
		<Card>
			<CardContent className="flex flex-col items-start gap-3">
				<div className="flex flex-col items-start gap-1">
					<CardTitle className="text-xl">{plan.name}</CardTitle>
					<CardDescription className="text-sm">{plan.description}</CardDescription>
				</div>

				<div className="flex items-baseline gap-1">
					<span className="text-2xl">￡</span>
					<span className="text-[2.5rem] font-medium">{(plan.monthlyPrice * BILLING_CYCLES[billingCycle].discount).toFixed(2).replace(/\.?0+$/, '')}</span>
					<span className="text-1xl text-muted-foreground">/ 月</span>
					{((1 - BILLING_CYCLES[billingCycle].discount) * 100) > 0 && plan.monthlyPrice > 0 && (
						<span className="text-xs bg-rose-400 text-white rounded px-[5px] py-[2px]">节约{((1 - BILLING_CYCLES[billingCycle].discount) * 100).toFixed(0)}%</span>
					)}
				</div>

				<Button className="w-full" size="lg" onClick={() => plan.monthlyPrice === 0 ? document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }) : null}>
					{Number(plan.monthlyPrice) === 0 ? '立即下载' : '立即订阅'}
				</Button>
			</CardContent>

			<Separator />

			<CardFooter>
				<div className="w-full flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<div className="text-xs text-muted-foreground">基础权益</div>
						<ul className="flex flex-col gap-1">
							{plan.features.base.map((feature, index) => (
								<li key={index} className="flex items-center gap-1 m-0">
									<CheckCircle size={20} className="text-green-500" weight="fill" />
									{feature}
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-xs text-muted-foreground">线路</div>
						<ul className="flex flex-col gap-1">
							{plan.features.route.map((feature, index) => (
								<li key={index} className="flex items-center gap-1 m-0">
									<CheckCircle size={20} className="text-green-500" weight="fill" />
									{feature}
								</li>
							))}
						</ul>
					</div>
					{plan.features.others.length > 0 && (
						<div className="flex flex-col gap-2">
							<div className="text-xs text-muted-foreground">其他</div>
							<ul className="flex flex-col gap-1">
								{plan.features.others.map((feature, index) => (
									<li key={index} className="flex items-center gap-1 m-0">
										<CheckCircle size={20} className="text-green-500" weight="fill" />
										{feature}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	)
}


function PriceCardData({ plan, tabKey, siteConfig }: { plan: Packages.Item, tabKey: BillingCycleKey, siteConfig: Packages.SiteConfig | null }) {
	const price = useMemo(() => {
		return plan[tabKey.valueKey] as string
	}, [plan, tabKey])

	useEffect(() => {
		console.log('tabKey', tabKey, siteConfig)
	}, [tabKey, siteConfig])

	// 单位 0对应天 1对应周 2对应月
	const getUnit = (unit: 0 | 1 | 2) => {
		let str = ''
		switch (unit) {
			case 0:
				str = '天'
				break
			case 1:
				str = '周'
				break
			case 2:
				str = '月'
				break
		}
		return str
	}
	return (
		<Card>
			<CardContent className="flex flex-col items-start gap-3">
				<div className="flex flex-col items-start gap-1">
					<CardTitle className="text-xl">{plan.name}</CardTitle>
					<CardDescription className="text-sm">{plan.description}</CardDescription>
				</div>

				<div className="flex items-baseline gap-1">
					<span className="text-2xl">￡</span>
					<span className="text-[2.5rem] font-medium">{price}</span>
					<span className="text-1xl text-muted-foreground">/ 月</span>
					{tabKey.discountKey && siteConfig && (
						<span className="text-xs bg-rose-400 text-white rounded px-[5px] py-[2px]">节约{((1 - siteConfig[tabKey.discountKey]) * 100).toFixed(0)}%</span>
					)}
				</div>

				<Button className="w-full" size="lg" onClick={() => plan.user_subscribed ? document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }) : null}>
					{plan.user_subscribed ? '立即下载' : '立即订阅'}
				</Button>
			</CardContent>

			<Separator />

			<CardFooter>
				<div className="w-full flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<div className="text-xs text-muted-foreground">基础权益</div>
						<ul className="flex flex-col gap-1">
							<li className="flex items-center gap-1 m-0">
								<CheckCircle size={20} className="text-green-500" weight="fill" />
								最多{plan.max_online_devices}台设备同时在线
							</li>
							<li className="flex items-center gap-1 m-0">
								<CheckCircle size={20} className="text-green-500" weight="fill" />
								不限制峰值速率
							</li>
							<li className="flex items-center gap-1 m-0">
								<CheckCircle size={20} className="text-green-500" weight="fill" />
								轻舟自研翻墙协议
							</li>
						</ul>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-xs text-muted-foreground">
							线路
							{
								plan.time_limit || plan.traffic_limit ? (
									<span className="text-xs">
										（整体限制 &nbsp;
										{plan.time_limit && `每${getUnit(plan.time_period)}${plan.time_limit}小时，`}
										{plan.traffic_limit && `每${getUnit(plan.traffic_period)}${plan.traffic_limit}GB流量`}
										）
									</span>
								) : null
							}
						</div>
						<ul className="flex flex-col gap-1">
							{plan.package_node_groups.map((group) => (
								<li key={group.id} className="flex items-center gap-1 m-0">
									<CheckCircle size={20} className="text-green-500" weight="fill" />
									{group.node_group.name}线路
									{
										group.time_limit && (
											<span className="text-xs text-muted-foreground">（每{getUnit(group.time_period)}{group.time_limit}小时）</span>
										)
									}
									{
										group.traffic_limit && (
											<span className="text-xs text-muted-foreground">（每{getUnit(group.traffic_period)}{group.traffic_limit}GB流量）</span>
										)
									}
								</li>
							))}
						</ul>
					</div>
					{/* {plan.features.others.length > 0 && (
						<div className="flex flex-col gap-2">
							<div className="text-xs text-muted-foreground">其他</div>
							<ul className="flex flex-col gap-1">
								{plan.features.others.map((feature, index) => (
									<li key={index} className="flex items-center gap-1 m-0">
										<CheckCircle size={20} className="text-green-500" weight="fill" />
										{feature}
									</li>
								))}
							</ul>
						</div>
					)} */}
				</div>
			</CardFooter>
		</Card>
	)
}