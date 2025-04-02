"use client"

import { Separator } from "@/components/ui/separator"
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/sections/section"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { CheckCircle } from "@phosphor-icons/react"
import { getPackages } from "@/api/packages"

type BillingCycle = 'monthly' | 'quarterly' | 'halfYearly' | 'yearly'

interface BillingCycleInfo {
	label: string
	discount: number
}

const BILLING_CYCLES: Record<BillingCycle, BillingCycleInfo> = {
	monthly: {
		label: '月付',
		discount: 1
	},
	quarterly: {
		label: '季付',
		discount: 0.88
	},
	halfYearly: {
		label: '半年付',
		discount: 0.75
	},
	yearly: {
		label: '年付',
		discount: 0.66
	}
}

const PRICE_DATA = {
	'free': {
		name: '免费套餐',
		description: '每日免费使用1小时（线路不限）',
		monthlyPrice: 0,
		features: {
			base: [
				'最多3台设备同时在线',
				'不限制峰值速率',
				'轻舟自研翻墙协议',
			],
			route: [
				'基础线路（每日总计限免1小时）',
				'CN2线路（每日总计限免1小时）',
			],
			others: [

			]
		}
	},
	'basic': {
		name: '基础套餐',
		description: '基础线路，CN2线路（每日限免1小时）',
		monthlyPrice: 3,
		features: {
			base: [
				'最多3台设备同时在线',
				'不限制峰值速率',
				'轻舟自研翻墙协议',
			],
			route: [
				'基础线路',
				'CN2线路（每日限免1小时）',
			],
			others: [

			]
		}
	},
	'pro': {
		name: '高级套餐',
		description: '基础线路，CN2线路',
		monthlyPrice: 5,
		features: {
			base: [
				'最多3台设备同时在线',
				'不限制峰值速率',
				'轻舟自研翻墙协议',
			],
			route: [
				'基础线路',
				'CN2线路',
			],
			others: [
				'技术支持优先响应',
			]
		}
	}
}

export function PriceSection() {
	const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
	const [packages, setPackages] = useState<Packages.Res>([])
	useEffect(() => {
		const fetchData = async () => {
			const res = await getPackages()
			console.log('res', res)
			setPackages(res.data)
		}
		fetchData()
	}, [])
	useEffect(() => {
		console.log('packages', packages)
	}, [packages])

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
					{Object.entries(PRICE_DATA).map(([key, plan]) => (
						<PriceCard
							key={key}
							plan={plan}
							billingCycle={billingCycle}
						/>
					))}
				</TabsContent>
				<TabsContent value="quarterly" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{Object.entries(PRICE_DATA).map(([key, plan]) => (
						<PriceCard
							key={key}
							plan={plan}
							billingCycle={billingCycle}
						/>
					))}
				</TabsContent>
				<TabsContent value="halfYearly" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{Object.entries(PRICE_DATA).map(([key, plan]) => (
						<PriceCard
							key={key}
							plan={plan}
							billingCycle={billingCycle}
						/>
					))}
				</TabsContent>
				<TabsContent value="yearly" className="w-full mt-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{Object.entries(PRICE_DATA).map(([key, plan]) => (
						<PriceCard
							key={key}
							plan={plan}
							billingCycle={billingCycle}
						/>
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