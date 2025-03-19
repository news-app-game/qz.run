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
    'android': VersionInfo;
    'ios': VersionInfo;
  }
  
  export const fetchVersions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/version-list`);
      if (!response.ok) {
        throw new Error('获取版本信息失败');
      }
      const result = await response.json();
      if (result.code === 200) {
        return result.data;
      } else {
        throw new Error(result.message || '获取版本信息失败');
      }
    } catch (err) {
      // setError(err instanceof Error ? err.message : '获取版本信息失败');
      console.error('获取版本信息错误:', err);
    }
  };
  