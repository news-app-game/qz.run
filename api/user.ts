import { request } from '@/tools/net';

export const login = async (data: User.LoginParams): Promise<User.LoginResponse> => {
  return request.post('/auth/login', data);
};

export const getUserInviteRecords = async (): Promise<User.InviteRecordsResponse> => {
  return request.get('/user/invite-records');
};

// 获取站点配置
export const getSiteConfig = async (): Promise<User.SiteConfigListRes> => {
  return request.get('/get-site-config');
};

export const register = async (data: User.RegisterParams): Promise<User.RegisterResponse> => {
  return request.post('/auth/register', data);
};

// 发送验证码
export const sendVerification = async (data: User.SendVerificationCodeParams): Promise<User.SendVerificationCodeResponse> => {
  return request.post('/auth/send-verification-email', data);
};

// 重置邮箱密码
export const resetEmailPassword = async (data: User.ResetEmailPasswordParams): Promise<User.ResetEmailPasswordResponse> => {
  return request.post('/auth/reset-email-password', data);
};
