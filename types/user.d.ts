declare namespace User {
  interface LoginParams {
    email: string;
    password: string;
  }

  interface Login {
    token: string;
    user: User.User;
  }

  type LoginResponse = Response<Login>;

  interface User {
    admin_role: 0 | number; // 1是已知的-普通用户
    created_at: string;
    email: string;
    id: number;
    invite_code: string;
  }

  interface InviteRecord {
    id: number;
    inviter_id: number;
    invitee_id: number;
    invitee: string;
    created_at: string;
  }

  type InviteRecordsResponse = Response<InviteRecord[]>;

  interface SiteConfigItem {
    id: number;
    key: string;
    value: string;
    created_at: string;
  }

  type SiteConfigListRes = Response<SiteConfigItem[]>;

  interface RegisterParams {
    email: string;
    password: string;
    password_confirmation: string;
    invite_code: string;
    code: string;
    register_source: 1;
  }

  type RegisterResponse = LoginResponse;

  interface SendVerificationCodeParams {
    email: string;
  }

  type SendVerificationCodeResponse = Response<null>;

  // 重置邮箱验证
  type ResetEmailPasswordParams = {
    email: string;
    code: string;
    password: string;
  };

  type ResetEmailPasswordResponse = Response<null>;
}
