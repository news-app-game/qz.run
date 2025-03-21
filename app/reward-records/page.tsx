import InviteRecord from "@/components/inviteRecords-form";
import RewardRecords from "@/components/rewardRecords";

export default function InviteRecords() {
  return (
    <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <RewardRecords />
      </div>
    </div>
  );
}
