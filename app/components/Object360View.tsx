"use client"
import React from "react";
import React360Viewer from "react-360-view";

const Object360View = () => {
  return (
    <div className="flex justify-center items-center ">
      <React360Viewer
        amount={9} // Number of images (1 to 9)
        imagePath="/image/" // Folder where images are stored
        fileName="image{index}.jpg" // Image naming pattern
      />
    </div>
  );
};

export default Object360View;
