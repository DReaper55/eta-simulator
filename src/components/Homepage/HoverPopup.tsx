import React, { useEffect, useState } from "react";
import { gridCanvas } from "../../utils/canvas";
import { ElementType } from "../../constants/element";

const HoverPopup: React.FC = () => {
  const [popupInfo, setPopupInfo] = useState<{ x: number; y: number; info: string | null }>({
    x: 0,
    y: 0,
    info: null,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const hoveredObject = gridCanvas.event?.moveEvent.hoveredObject;

      if (hoveredObject && hoveredObject.userData && hoveredObject.userData.type !== ElementType.City) {
        setPopupInfo({
          x: event.clientX,
          y: event.clientY,
          info: hoveredObject.userData?.info || "Unknown Element",
        });
      } else {
        setPopupInfo({ x: 0, y: 0, info: null });
      }

    //   if(hoveredObject && hoveredObject.userData && hoveredObject.userData.type === ElementType.Building){
    //     console.log({
    //         x: event.clientX,
    //         y: event.clientY,
    //         info: hoveredObject?.userData?.info || "Unknown Element",
    //       })
    //   }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!popupInfo.info) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: popupInfo.y + 10,
        left: popupInfo.x + 10,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {popupInfo.info}
    </div>
  );
};

export default HoverPopup;
