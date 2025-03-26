"use client";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
  Lightning,
  Cpu,
  ShieldCheckered,
  ArrowsDownUp,
  AndroidLogo,
  AppleLogo,
  WindowsLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { detectOSAndArchitecture, OperatingSystem } from "@/lib/utils";
import { fetchVersions, VersionData } from "@/lib/apis";

export default function Home() {
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [versions, setVersions] = useState<VersionData | null>(null);
  const [system, setSystem] = useState<OperatingSystem>("Unknown");
  const detectOSAndArch = async () => {
    const { os } = await detectOSAndArchitecture();
    setSystem(os);
  };

  useEffect(() => {
    detectOSAndArch();
    fetchVersions().then((versions) => setVersions(versions));
  }, []);

  const SystemIcon = () => {
    if (system === "Windows") {
      return (
        <svg
          className="w-5 h-5 text-[#ffffff]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M0 12v-8.646l10-1.355v10.001h-10zm11 0h13v-12l-13 1.807v10.193zm-1 1h-10v7.646l10 1.355v-9.001zm1 0v9.194l13 1.806v-11h-13z" />
        </svg>
      );
    } else if (system === "MacOS" || system === "iOS") {
      return (
        <svg
          className="icon w-5 h-5 relative bottom-[1px]"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
        >
          <path
            d="M645.289723 165.758826C677.460161 122.793797 701.865322 62.036894 693.033384 0c-52.607627 3.797306-114.089859 38.61306-149.972271 84.010072-32.682435 41.130375-59.562245 102.313942-49.066319 161.705521 57.514259 1.834654 116.863172-33.834427 151.294929-79.956767zM938.663644 753.402663c-23.295835 52.820959-34.517089 76.415459-64.511543 123.177795-41.855704 65.279538-100.905952 146.644295-174.121433 147.198957-64.980873 0.725328-81.748754-43.30636-169.982796-42.751697-88.234042 0.46933-106.623245 43.605024-171.732117 42.965029-73.130149-0.682662-129.065752-74.026142-170.964122-139.348347-117.11917-182.441374-129.44975-396.626524-57.172928-510.545717 51.327636-80.895427 132.393729-128.212425 208.553189-128.212425 77.482118 0 126.207106 43.519692 190.377318 43.519692 62.292892 0 100.137957-43.647691 189.779989-43.647691 67.839519 0 139.732344 37.802399 190.889315 103.03927-167.678812 94.036667-140.543004 339.069598 28.885128 404.605134z"
            fill="#ffffff"
          ></path>
        </svg>
      );
    } else if (system === "Android") {
      return (
        <svg
          className="icon w-5 h-5 relative bottom-[1px]"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
        >
          <path
            fill="#ffffff"
            d="M229.493567 343.057721h565.073089v409.938453a67.449841 67.449841 0 0 1-67.02828 67.750957h-46.311543v139.717528a63.414895 63.414895 0 1 1-126.82979 0v-139.717528H469.602957v139.717528c0 35.049828-28.42529 63.354672-63.535341 63.354672a63.234226 63.234226 0 0 1-62.752442-63.354672l-0.542007-139.717528h-45.588866a67.570287 67.570287 0 0 1-67.690734-67.750957V343.057721z m-87.443901-11.683276a63.234226 63.234226 0 0 0-63.414895 62.752441v264.740626c0 35.110051 28.365067 63.354672 63.414895 63.354672s62.752441-28.304844 62.752442-63.354672V394.126886c0-34.387374-28.184398-62.752441-62.752442-62.752441z m654.323682-10.478815H227.024422c0-97.862493 58.536826-182.837248 145.318273-227.101206L328.560522 13.215953a8.973238 8.973238 0 0 1 3.071376-12.34573c4.275838-1.866915 9.876584-0.662454 12.34573 3.733831l44.263958 81.240925c37.63942-16.681791 79.494456-25.895921 123.758414-25.895922s86.118993 9.21413 123.758414 25.835698L680.022372 4.543831c2.469146-4.336061 8.069892-5.540523 12.34573-3.733831a8.973238 8.973238 0 0 1 3.071376 12.34573l-43.782173 80.578471c86.23944 44.324181 144.716043 129.298936 144.716043 227.161429zM406.067616 194.126063a23.968783 23.968783 0 0 0-23.90856-24.029006 23.90856 23.90856 0 0 0-23.426775 24.029006c0 12.887737 10.418592 23.968783 23.426775 23.968782a23.90856 23.90856 0 0 0 23.90856-23.968782z m259.200103 0a23.90856 23.90856 0 0 0-23.426775-24.029006 23.968783 23.968783 0 0 0 0 47.997788 23.788114 23.788114 0 0 0 23.426775-23.968782z m216.682615 137.248382a62.631995 62.631995 0 0 0-62.752442 62.752441v264.740626a63.053557 63.053557 0 1 0 126.167337 0V394.126886a62.872888 62.872888 0 0 0-63.414895-62.752441z"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      );
    }
  };

  const DownloadButton = () => {
    let href: string | undefined;
    const baseURL = "https://qz.run/download/";
    if (system === "Windows") {
      href = `${baseURL}${versions?.["windows-x64"]?.download_url ?? ""}`;
    }
    if (system === "MacOS") {
      href = `${baseURL}${versions?.["macos-x64"]?.download_url ?? ""}`;
    }
    if (system === "Android") {
      href = `${baseURL}${versions?.["android"]?.download_url ?? ""}`;
    }
    if (system === "iOS") {
      // iOS 版本开发中，不设置下载链接
      href = undefined;
    }

    const handleClick = (event: { preventDefault: () => void }) => {
      if (!href) {
        event.preventDefault();
        // 如果是 iOS，显示开发中提示
        if (system === "iOS") {
          alert("iOS 版本正在开发中，敬请期待！");
        }
      }
    };

    return (
      <a
        href={href}
        onClick={handleClick}
        className="bg-[#3B82F6] text-white px-8 py-2 rounded-t-lg font-medium hover:bg-[#2563EB] transition-all duration-300 flex items-center gap-2 group-hover:rounded-b-none"
      >
        <SystemIcon />
        <span>立即下载</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDownloadMenuOpen ? "rotate-180" : ""
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>
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
                className="relative group cursor-pointer z-20"
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                onMouseEnter={() => setIsDownloadMenuOpen(true)}
                onMouseLeave={() => setIsDownloadMenuOpen(false)}
              >
                <DownloadButton />
                {isDownloadMenuOpen && (
                  <div className="absolute left-0 right-0 mt-0">
                    <div className="bg-white rounded-b-lg shadow-xl border border-gray-100 overflow-hidden">
                      <a
                        href={`https://qz.run/download/${versions?.["windows-x64"]?.download_url ?? ""
                          }`}
                        target="_blank"
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-3"
                      >
                        <i className="fa fa-windows text-[#3B82F6]"></i>
                        Windows(x64)
                      </a>
                      <a
                        href={`https://qz.run/download/${versions?.["macos-arm64"]?.download_url ?? ""
                          }`}
                        target="_blank"
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-3"
                      >
                        <i className="fa fa-apple text-[#3B82F6]"></i>
                        MacOS (ARM64)
                      </a>
                      <a
                        href={`https://qz.run/download/${versions?.["macos-x64"]?.download_url ?? ""
                          }`}
                        target="_blank"
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-3"
                      >
                        <i className="fa fa-apple text-[#3B82F6]"></i>
                        MacOS (Intel)
                      </a>
                      <a
                        href={`https://qz.run/download/${versions?.["android"]?.download_url ?? ""
                          }`}
                        target="_blank"
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-3"
                      >
                        <i className="fa fa-android text-[#3B82F6]"></i>
                        Android
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("iOS 版本正在开发中，敬请期待！");
                        }}
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-3"
                      >
                        <i className="fa fa-apple text-[#3B82F6]"></i>
                        iOS
                      </a>
                    </div>
                  </div>
                )}
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
                    `https://qz.run/download/${versions?.["android"]?.download_url ?? ""
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
                  window.open(
                    `https://qz.run/download/${versions?.["ios"]?.download_url ?? ""
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
                macOS
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex flex-col gap-3">
                <Button className="w-full" variant="outline" onClick={() => {
                  window.open(
                    `https://qz.run/download/${versions?.["macos-x64"]?.download_url ?? ""
                    }`,
                    '_blank'
                  );
                }}>
                  下载 Intel 芯片版
                </Button>
                <Button className="w-full" variant="outline" onClick={() => {
                  window.open(
                    `https://qz.run/download/${versions?.["macos-arm64"]?.download_url ?? ""
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
                    `https://qz.run/download/${versions?.["windows-x64"]?.download_url ?? ""
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
