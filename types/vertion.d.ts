declare namespace Version {
  interface Info {
    id: number;
    version: string;
    platform: string;
    download_url: string;
  }
  interface Data {
    'windows-x64': Info;
    'macos-arm64': Info;
    'macos-x64': Info;
    'android': Info;
    'ios': Info;
  }
  type Res = Response<Data>;
}
