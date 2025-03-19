import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 定义操作系统类型
export type OperatingSystem = 'Windows' | 'MacOS' | 'Linux' | 'iOS' | 'Android' | 'Unknown';
// 定义更详细的架构类型
export type Architecture = 'x86' | 'x64' | 'ARM32' | 'ARM64' | 'Unknown';

// 自动识别操作系统和架构的函数
export async function detectOSAndArchitecture(): Promise<{ os: OperatingSystem; architecture: Architecture }> {
  let os: OperatingSystem = 'Unknown';
  let architecture: Architecture = 'Unknown';
  
  // 回退到 navigator.userAgent
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLocaleLowerCase();
  const isMobile = /iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);
  // 识别操作系统
  if (!isMobile) {
    if (userAgent.indexOf('win') !== -1) {
      os = 'Windows';
    } else if (userAgent.indexOf('mac') !== -1) {
      os = 'MacOS';
    } else if (userAgent.indexOf('linux') !== -1) {
      os = 'Linux';
    }
  } else {
    if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
      os = 'iOS';
    } else if (userAgent.indexOf('android') !== -1) {
      os = 'Android';
    }
  }
  
  if (!isMobile) {
    // 识别架构（userAgent 识别架构准确性较低）
    if (userAgent.includes('x64') || userAgent.includes('amd64') || userAgent.includes('x86')) {
      architecture = 'x64';
    }
    if (userAgent.includes('arm64') || userAgent.includes('arm')) {
      architecture = 'ARM64';
    }
    if (userAgent.includes('intel')) {
      architecture = 'x64';
    }
  } else {
    if (/iPhone|iPod|iPad/i.test(userAgent)) {
      architecture = "ARM64";
    }
    if (/Android|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(userAgent)) {
      architecture = 'x86';
    }
  }
  
  return {os, architecture};
}
