import { getVersionList } from '@/api/version';
export interface VersionInfo {
  id: number;
  version: string;
  platform: string;
  download_url: string;
}

export interface VersionData {
  'windows-x64': VersionInfo;
  'macos-arm64': VersionInfo;
  'macos-x64': VersionInfo;
  android: VersionInfo;
  ios: VersionInfo;
}

export const fetchVersions = async () => {
  try {
    const { code, data, message } = await getVersionList();
    if (code === 200) {
      return data;
    } else {
      throw new Error(message || '获取版本信息失败');
    }
  } catch (err) {
    console.error('获取版本信息错误:', err);
  }
};
