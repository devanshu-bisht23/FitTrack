import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useAppContext } from "../context/AppContext";
import api from "../configs/api";
import toast from "react-hot-toast";

const StepTracker = () => {
  const { allStepLogs, setAllStepLogs } = useAppContext();
  const today = new Date().toISOString().split("T")[0];

  const todayEntry = allStepLogs.find((s) => s.date === today);

  const [steps, setSteps] = useState<number>(todayEntry?.steps || 0);
  const [isEditing, setIsEditing] = useState(!todayEntry);

  const handleSubmit = async () => {
    if (!steps || steps <= 0) {
      return toast.error("Enter valid steps");
    }

    try {
      const calories = Math.max(1, Math.round(steps * 0.04));

      const { data } = await api.post("/api/step-logs", {
        data: { steps, calories, date: today },
      });

      // remove old entry for today if exists
      const filtered = allStepLogs.filter((s) => s.date !== today);
      setAllStepLogs([...filtered, data]);

      toast.success(todayEntry ? "Steps updated!" : "Steps saved!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error.message);
    }
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">👣 Steps Today</h3>

      {!isEditing && todayEntry ? (
        <div className="space-y-3">
          <div>
            <p className="text-xl font-bold">{todayEntry.steps} steps</p>
            <p className="text-sm text-slate-500">
              {Math.round(todayEntry.calories)} kcal burned
            </p>
          </div>

          <Button onClick={() => setIsEditing(true)}>
            Edit Steps
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            type="number"
            label="Enter today's steps"
            value={steps}
            onChange={(v) => setSteps(Number(v))}
          />

          <Button onClick={handleSubmit}>
            {todayEntry ? "Update Steps" : "Save Steps"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default StepTracker;