import React from "react";
import { Skeleton } from "primereact/skeleton";

export default function SkeletonPost() {
  return (
    <div className="card">
      <div className="border-round border-1 surface-border surface-card p-4">
        <div className="mb-3 flex">
          <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
          <div>
            <Skeleton width="10rem" className="mb-2"></Skeleton>
            <Skeleton width="5rem" className="mb-2"></Skeleton>
            <Skeleton height=".5rem"></Skeleton>
          </div>
        </div>
        <Skeleton width="100%" height="150px"></Skeleton>
        <div className="justify-content-between mt-3 flex">
          <Skeleton width="4rem" height="2rem"></Skeleton>
          <Skeleton width="4rem" height="2rem"></Skeleton>
        </div>
      </div>
    </div>
  );
}
