declare namespace API {
  interface NoticeItem {
    id: number;
    title: string;
    content: string;
    type: number;
    status: boolean;
    start_at: string;
    end_at: string;
    created_at: string;
    updated_at: string;
  }

  type NoticeListRes = Response<NoticeItem[]>;

  type NoticeDetailRes = Response<NoticeItem>;

  interface AdminNoticeParams {
    page?: number;
    per_page?: number;
  }

  interface AdminNoticeItem {
    id: number;
    title: string;
    created_at: string;
    status: boolean;
    start_at: string;
    end_at: string;
    content: string;
  }
  interface AdminNoticeMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }

  type AdminNoticeRes = Response<{
    meta: AdminNoticeMeta;
    notices: AdminNoticeItem[];
  }>;

  type AdminNoticeDeleteRes = Response<null>;

  // 编辑
  interface AdminNoticeCEParams {
    title: string;
    status: boolean;
    start_at: string;
    end_at: string;
    content: string;
  }
  type AdminNoticeCERes = Response<null>;
}
