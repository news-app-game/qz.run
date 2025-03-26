"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/tools/auth";
import { getRewardRecords } from "@/api/reward";
export default function RewardRecords() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchRewardRecords();
  }, []);

  const fetchRewardRecords = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const { code, data, message } = await getRewardRecords()
      if (code === 200) {
        setRecords(data);
      } else {
        setError(message || "获取奖励记录失败");
      }
    } catch (error) {
      console.log(error);
      setError("获取奖励记录失败，请检查网络连接");
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">奖励记录</h2>

          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>

        <div className="mt-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无奖励记录，快去邀请好友获取奖励吧！
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
                        类型
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        奖励时长
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
                    {records.map((record: any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.type_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {record.duration_detail}
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
