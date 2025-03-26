declare namespace Invite {
  interface Code {
    code: string;
    created_at: string;
    id: number;
    status: number;
    updated_at: string;
    used_at: string | null;
    used_by: string | null;
  }
  type Res = Response<{
    dailyLimit: number;
    inviteCodes: Code[];
    nextDay: string;
  }>;
}
