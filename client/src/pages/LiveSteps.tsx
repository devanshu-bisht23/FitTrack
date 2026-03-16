import { useRef, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../configs/api";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const LiveSteps = () => {
  const { user } = useAppContext();
  const [steps, setSteps] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [duration, setDuration] = useState(0);

  const startTime = useRef<number | null>(null);
  const intervalRef = useRef<any>(null);

  // Detect motion from phone
  const handleMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) return;

    const magnitude =
      Math.abs(acceleration.x || 0) +
      Math.abs(acceleration.y || 0) +
      Math.abs(acceleration.z || 0);

    // threshold detection
    if (magnitude > 25) {
      setSteps(prev => prev + 1);
    }
  };

  const startTracking = () => {

    if (tracking) return;

    setTracking(true);
    startTime.current = Date.now();

    window.addEventListener("devicemotion", handleMotion);

    intervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - (startTime.current || 0)) / 1000));
    }, 1000);
  };

  const stopTracking = async () => {

        if (!user) {
        toast.error("User not authenticated");
        return;
    }

    setTracking(false);

    window.removeEventListener("devicemotion", handleMotion);

    clearInterval(intervalRef.current);

    const calories = Math.round(steps * 0.04);
    const minutes = Math.round(duration / 60);
 
    try {

      await api.post("/api/activity-logs", {
        data: {
            name: "Walking",
            steps: steps,
            duration: minutes,
            calories: calories,
            users_permissions_user: user.id,
            publishedAt: new Date()
            }
        });

      toast.success("Activity saved!");

    } catch (err) {
      toast.error("Failed to save activity");
    }

    setSteps(0);
    setDuration(0);
  };

  return (

    <div className="page-container">

      <Card>

        <h2 className="text-xl font-bold mb-4">👣 Live Step Tracker</h2>

        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-400">Steps</p>
            <p className="text-4xl font-bold">{steps}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Duration</p>
            <p className="text-2xl font-bold">
              {Math.floor(duration / 60)}m {duration % 60}s
            </p>
          </div>

          <div className="flex gap-4">

            <Button
              onClick={startTracking}
              disabled={tracking}
            >
              Start Tracking
            </Button>

            <Button
              onClick={stopTracking}
              disabled={!tracking}
              className="bg-red-500"
            >
              Stop Tracking
            </Button>

          </div>

        </div>

      </Card>

    </div>
  );
};

export default LiveSteps;