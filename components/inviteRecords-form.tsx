"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUserInviteRecords } from "@/api/user";
import { getUser } from "@/tools/auth";

export default function InviteRecords() {
  const [records, setRecords] = useState<User.InviteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User.User | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUser(user);
    }
    fetchInviteRecords();
  }, []);

  const fetchInviteRecords = async () => {
    try {
      const { code, data, message } = await getUserInviteRecords()
      if (code === 200) {
        // setRecords(data);
        return
      } else {
        setError(message || "获取邀请记录失败");
      }
    } catch (error) {
      console.log(error);
      setError("获取邀请记录失败，请检查网络连接");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyInviteCode = () => {
    if (!user?.invite_code) return;
    navigator.clipboard
      .writeText(user.invite_code)
      .then(() => {
        toast.success("邀请码已复制到剪贴板");
      })
      .catch(() => {
        alert("复制失败，请手动复制");
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mt-6">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">邀请记录</h2>

          <div className="mt-4 flex justify-center items-center space-x-2">
            <span className="text-gray-600">我的邀请码：</span>
            <span className="font-medium text-primary">
              {user?.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              复制
            </button>
          </div>

          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>

        <div className="mt-12 w-full">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full">
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无邀请记录，快去邀请好友注册吧！邀请一个赠送7天试用期！
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        被邀请人
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        奖励
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        时间
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.invitee || "未使用"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                          >
                            7天
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
