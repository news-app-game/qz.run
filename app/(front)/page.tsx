"use client";
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import Image from "next/image";
import { Lightning, Cpu, ShieldCheckered, ArrowsDownUp, AndroidLogo, AppleLogo, WindowsLogo, } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchVersions, VersionData } from "@/lib/apis";
import { PriceSection } from "@/components/sections/price-section";

export default function Home() {
  const [versions, setVersions] = useState<VersionData | null>(null);

  useEffect(() => {
    fetchVersions().then((versions) => setVersions(versions));
  }, []);

  const DownloadButton = () => {
    return (
      <Link href="#download">
        <Button className="md:w-auto" size="lg">下载客户端</Button>
      </Link>
    );
  };
  return (
    <>
      <Section>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 py-0 md:py-10">
          <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-3xl md:text-4xl font-bold">
                轻舟一叶，纵横无界
              </div>
              <div className="text-lg md:text-xl text-muted-foreground">
                轻舟VPN，让你自在畅游大千世界
              </div>
            </div>
            <div className="w-full flex justify-center md:justify-start gap-3">
              <div
                className="group cursor-pointer">
                <DownloadButton />
              </div>
              <Link href="/invitation-code">
                <Button className="md:w-auto" size="lg" variant="outline">
                  获取邀请码
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src="/macOS.png"
            alt="logo"
            width={2280}
            height={1381}
            className="rounded-lg w-full select-none md:w-9/16"
          />
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>大陆地区首选VPN</SectionTitle>
          <SectionDescription>
            自研协议，并针对大陆地区网络环境优化
          </SectionDescription>
        </SectionHeader>
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-6">
            <Lightning
              size={40}
              weight="fill"
              color={"var(--accent-foreground)"}
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">快如闪电</h3>
              <p className="text-muted-foreground">
                高价购入优质线路，精心优化传输算法，只为您上网更爽快。
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Cpu size={40} weight="fill" color={"var(--accent-foreground)"} />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">自研协议</h3>
              <p className="text-muted-foreground">
                使用自研翻墙协议，比市面上的常见协议更稳定更安全。
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <ShieldCheckered
              size={40}
              weight="fill"
              color={"var(--accent-foreground)"}
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">安全可靠</h3>
              <p className="text-muted-foreground">
                采用先进的加密技术，确保您的数据安全。
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <ArrowsDownUp
              size={40}
              weight="fill"
              color={"var(--accent-foreground)"}
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">不限流量</h3>
              <p className="text-muted-foreground">
                不限制您的流量使用，您想用多少就用多少。
              </p>
            </div>
          </div>
        </div>
      </Section>

      <PriceSection />
      
      <Section>
        <SectionHeader>
          <SectionTitle>跨平台可用</SectionTitle>
          <SectionDescription>
            自行开发的客户端 App 支持 Android、iOS、macOS、和 Windows
          </SectionDescription>
        </SectionHeader>
        <Image
          src="/devices.png"
          alt="devices"
          width={1920}
          height={1080}
          className="rounded-lg select-none"
        />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>常见问题</SectionTitle>
          <SectionDescription>
            这些问题的答案可以帮助您了解我们的服务和产品
          </SectionDescription>
        </SectionHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>一个账号同时允许几个设备在线？</AccordionTrigger>
            <AccordionContent>3个</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>你们的 VPN 能在哪些设备上运作？</AccordionTrigger>
            <AccordionContent>
              我们的 VPN 可以在 Android、iOS、macOS、和 Windows 上运作。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>你们记录我的上网流量日志吗？</AccordionTrigger>
            <AccordionContent>不会记录您的上网流量日志。</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>下载轻舟</SectionTitle>
          <SectionDescription>
            根据您的设备平台下载对应的版本
          </SectionDescription>
        </SectionHeader>
        <div
          id="download"
          className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AndroidLogo size={24} weight="fill" />
                Android
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.open(
                    `https://download.qz.run/download/${versions?.["android"]?.download_url ?? ""
                    }`,
                    '_blank'
                  );
                }}
              >
                下载
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AppleLogo size={24} weight="fill" />
                iOS
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  alert("iOS 版本正在开发中，敬请期待！");
                }}
              >
                下载
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AppleLogo size={24} weight="fill" />
                macOS
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex flex-col gap-3">
                <Button className="w-full" variant="outline" onClick={() => {
                  window.open(
                    `https://download.qz.run/download/${versions?.["macos-x64"]?.download_url ?? ""
                    }`,
                    '_blank'
                  );
                }}>
                  下载 Intel 芯片版
                </Button>
                <Button className="w-full" variant="outline" onClick={() => {
                  window.open(
                    `https://download.qz.run/download/${versions?.["macos-arm64"]?.download_url ?? ""
                    }`,
                    '_blank'
                  );
                }}>
                  下载 Apple 芯片版
                </Button>
                <Link
                  href="/help-center"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  不确定哪个版本？查看帮助
                </Link>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WindowsLogo size={24} weight="fill" />
                Windows
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.open(
                    `https://download.qz.run/download/${versions?.["windows-x64"]?.download_url ?? ""
                    }`,
                    '_blank'
                  );
                }}
              >
                下载
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </>
  );
}
