"use client";
import TrueFocus from "@/components/TrueFocus";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <TrueFocus
        sentence="404 | This page couldn't be found"
        manualMode={false}
        blurAmount={5}
        borderColor="green"
        animationDuration={0.5}
        pauseBetweenAnimations={1}
      />
    </div>
  );
};

export default NotFound;
