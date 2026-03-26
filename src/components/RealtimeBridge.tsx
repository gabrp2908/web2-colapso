import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { connectRealtime, disconnectRealtime } from "@/lib/realtime/socket";

type NotificationCreatedPayload = {
  notification_id: number;
  notification_tit?: string | null;
  notification_ty?: string | null;
  user_id: number;
};

type DevolutionRegisteredPayload = {
  movement_id: number;
  user_id: number;
  pending_items: number;
  damaged_items: number;
};

const RealtimeBridge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      disconnectRealtime();
      return;
    }

    const socket = connectRealtime();

    const onNotificationCreated = (payload: NotificationCreatedPayload) => {
      if (payload.user_id !== user.userId) return;

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.info(payload.notification_tit ?? "Nueva notificación");
    };

    const onDevolutionRegistered = (payload: DevolutionRegisteredPayload) => {
      if (payload.user_id !== user.userId) return;

      queryClient.invalidateQueries({ queryKey: ["devolutions"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });

      if (payload.pending_items > 0) {
        toast.warning("Devolución parcial registrada");
      } else if (payload.damaged_items > 0) {
        toast.error("Devolución registrada con daño");
      } else {
        toast.success("Devolución registrada");
      }
    };

    socket.on("notification.created", onNotificationCreated);
    socket.on("devolution.registered", onDevolutionRegistered);

    return () => {
      socket.off("notification.created", onNotificationCreated);
      socket.off("devolution.registered", onDevolutionRegistered);
    };
  }, [user, queryClient]);

  return null;
};

export default RealtimeBridge;
